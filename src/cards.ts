import { AppDataSource } from "./data-source";
import { Card } from "./entities/card";
import { Image } from "./entities/image";
import express from "express";
import { CardsPostRequest } from "./request-types/cards";
import { TypedRequestBody } from "./typed-request";

/**
 * @openapi
 * tags:
 *   name: Cards API
 *   description: Card management
 */
const cardsRouter = express.Router();

// Get TypeORM repository for card and image entity.
const cardRepository = AppDataSource.getRepository(Card);
const imageRepository = AppDataSource.getRepository(Image);

// Use JSON for this endpoint.
cardsRouter.use(express.json());

/**
 * @openapi
 * /cards:
 *   get:
 *     summary: Get all cards.
 *     tags: [Cards API]
 *     responses:
 *       "200":
 *         description: The request succeeded.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Card'
 *   post:
 *     summary: Create a card.
 *     tags: [Cards API]
 *     requestBody:
 *       description: A JSON object of card details.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CardsPostRequest'
 *     responses:
 *       "201":
 *         description: The request succeeded.
 *       "422":
 *         description: Failed to create card using given request body.
 */
// On GET request on endpoint root, respond with all cards.
cardsRouter.get("/", async (_, res) => {
  res.send(await cardRepository.find({ relations: ["image"] }));
});

// On POST requests, create card with given parameters.
cardsRouter.post("/", async (req: TypedRequestBody<CardsPostRequest>, res) => {
  const card = new Card();

  // Respond with 422 error if bote image ID and term is null.
  if (req.body.imageId == null && req.body.term == null) {
    res.statusCode = 422;
    res.end();
    return;
  }

  card.label = req.body.label;
  card.term = req.body.term;
  let image = null;
  if (req.body.imageId != null)
    image = await imageRepository.findOneBy({ id: req.body.imageId });
  card.image = image;

  await AppDataSource.manager.save(card);

  // Respond with 201 when created successfully.
  res.statusCode = 201;
  res.end();
});

/**
 * @openapi
 * /cards/{id}:
 *   get:
 *     summary: Get a card with specified ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the card to get.
 *     tags: [Cards API]
 *     responses:
 *       "200":
 *         description: The request succeeded.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Card'
 *       "400":
 *         description: Failed to parse ID.
 *       "404":
 *         description: Card with specified ID does not exist.
 *   put:
 *     summary: Update a card with specified ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the card to update.
 *     tags: [Cards API]
 *     requestBody:
 *       description: A JSON object of card details.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CardsPostRequest'
 *     responses:
 *       "200":
 *         description: The request succeeded.
 *       "400":
 *         description: Failed to parse ID.
 *       "404":
 *         description: Card with specified ID does not exist.
 *       "422":
 *         description: Failed to update card using given request body.
 *   delete:
 *     summary: Delete a card with specified ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the card to delete.
 *     tags: [Cards API]
 *     responses:
 *       "200":
 *         description: The request succeeded.
 *       "400":
 *         description: Failed to parse ID.
 *       "404":
 *         description: Card with specified ID does not exist.
 */
// On GET request with ID, respond with the card with corresponding ID.
cardsRouter.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  // Respond with 400 error if ID cannot be parsed.
  if (isNaN(id)) {
    res.statusCode = 400;
    res.end();
    return;
  }

  const findResult = await cardRepository.findOne({
    where: { id: id },
    relations: ["image"],
  });

  // Respond with 404 error if the card with ID is nonexistent.
  if (findResult == undefined) {
    res.statusCode = 404;
    res.end();
    return;
  }

  res.send(findResult);
});

// On PUT requests, update the card with corresponding ID.
cardsRouter.put(
  "/:id",
  async (req: TypedRequestBody<CardsPostRequest>, res) => {
    const id = parseInt(req.params.id);

    // Respond with 400 error if ID cannot be parsed.
    if (isNaN(id)) {
      res.statusCode = 400;
      res.end();
      return;
    }

    // Respond with 422 error if both image ID and term is null.
    if (req.body.imageId == null && req.body.term == null) {
      res.statusCode = 422;
      res.end();
      return;
    }

    const card = new Card();

    // Respond with 404 error if the card with ID is nonexistent.
    if (card == null) {
      res.statusCode = 404;
      res.end();
      return;
    }

    card.label = req.body.label;
    card.term = req.body.term;
    await cardRepository.update(id, card);

    let image = null;
    if (req.body.imageId != null)
      image = await imageRepository.findOneBy({ id: req.body.imageId });
    await cardRepository
      .createQueryBuilder()
      .relation("image")
      .of(id)
      .set(image);
    res.end();
  }
);

// On DELETE requests, delete the card with corresponding ID.
cardsRouter.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  // Respond with 400 error if ID cannot be parsed.
  if (isNaN(id)) {
    res.statusCode = 400;
    res.end();
    return;
  }

  const card = await cardRepository.findOneBy({ id: id });

  // Respond with 404 error if the card with ID is nonexistent.
  if (card == null) {
    res.statusCode = 404;
    res.end();
    return;
  }
  await cardRepository.remove(card);
  res.end();
});

export default cardsRouter;
