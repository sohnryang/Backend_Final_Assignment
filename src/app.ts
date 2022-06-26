import "dotenv/config"; // Should be first
import "reflect-metadata";

import { AppDataSource } from "./data-source";
import express from "express";
import cors from "cors";
import path from "path";
import cardsRouter from "./cards";
import imagesRouter from "./images";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

AppDataSource.initialize()
  .then(() => {
    const app = express();
    const distPath = path.join(
      __dirname,
      process.env.FRONTEND_DIST || "../frontend/dist"
    );

    app.use(express.static(distPath));
    app.use(cors());
    app.use("/cards", cardsRouter);
    app.use("/images", imagesRouter);

    const specs = swaggerJSDoc({
      definition: {
        openapi: "3.0.0",
        info: {
          title: "Memory box API docs",
          version: "1.0.0",
          description: "Docs for card and image management APIs",
          license: { name: "MIT", url: "https://spdx.org/licenses/MIT.html" },
        },
      },
      apis: [
        "./src/cards.ts",
        "./src/images.ts",
        "./src/entities/*.ts",
        "./src/request-types/*.ts",
      ],
    });
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

    app.get("/", (_, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });

    const port = process.env.PORT || 8080;
    app.listen(port, () => {
      console.log(`Server started on port: ${port}`);
    });
  })
  .catch((err) => console.log(err));
