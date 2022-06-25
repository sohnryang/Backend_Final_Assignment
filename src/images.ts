import { AppDataSource } from "./data-source";
import { Image } from "./entities/image";
import express from "express";
import multer from "multer";
import multerS3 from "multer-s3";
import { defaultClient, deleteObject, fetchSignedUrl } from "./aws-utils";

/**
 * @openapi
 * tags:
 *   name: Images API
 *   description: Image management
 */
const imagesRouter = express.Router();

// Use JSON for this endpoint.
imagesRouter.use(express.json());

// Set up multer for uploading to S3. (actually cloudflare R2)
const upload = multer({
  storage: multerS3({
    s3: defaultClient,
    bucket: process.env.BUCKET_NAME!,
    metadata: (_, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (_, file, cb) => {
      cb(null, `${Date.now().toString()}.${file.originalname}`);
    },
  }),
});

// Get TypeORM repository for image entity.
const imageRepository = AppDataSource.getRepository(Image);

/**
 * @openapi
 * /images:
 *   post:
 *     summary: Create an image.
 *     tags: [Images API]
 *     requestBody:
 *       description: An image file.
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       "201":
 *         description: The request succeeded.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Image'
 *       "400":
 *         description: File was not provided.
 */
imagesRouter.post("/", upload.single("image"), async (req, res) => {
  if (req.file == undefined) {
    return res.status(400).send();
  }

  const image = new Image();
  // @ts-ignore
  image.name = req.file.key;

  const savedImage = await imageRepository.save(image);
  res.statusCode = 201;
  res.send(savedImage);
});

/**
 * @openapi
 * /images/{id}:
 *   get:
 *     summary: Get an image with specified ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the image to get.
 *     tags: [Images API]
 *     responses:
 *       "302":
 *         description: The request succeeded.
 *       "400":
 *         description: Failed to parse ID.
 *       "404":
 *         description: Card with specified ID does not exist.
 *   delete:
 *     summary: Delete an image with specified ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the image to delete.
 *     tags: [Images API]
 *     responses:
 *       "200":
 *         description: The request succeeded.
 *       "400":
 *         description: Failed to parse ID.
 *       "404":
 *         description: Image with specified ID does not exist.
 */
imagesRouter.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  // Respond with 400 error if ID cannot be parsed.
  if (isNaN(id)) {
    res.statusCode = 400;
    res.end();
    return;
  }

  const findResult = await imageRepository.findOneBy({ id: id });

  // Respond with 404 error if the card with ID is nonexistent.
  if (findResult == undefined) {
    res.statusCode = 404;
    res.end();
    return;
  }

  const url = await fetchSignedUrl(findResult.name);
  return res.redirect(url);
});

imagesRouter.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  // Respond with 400 error if ID cannot be parsed.
  if (isNaN(id)) {
    res.statusCode = 400;
    res.end();
    return;
  }

  const image = await imageRepository.findOneBy({ id: id });

  // Respond with 404 error if the card with ID is nonexistent.
  if (image == null) {
    res.statusCode = 404;
    res.end();
    return;
  }
  await deleteObject(image.name);
  await imageRepository.remove(image);
  res.end();
});

export default imagesRouter;
