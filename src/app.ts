import "dotenv/config"; // Should be first
import "reflect-metadata";

import { AppDataSource } from "./data-source";
import express from "express";
import path from "path";
import cardsRouter from "./cards";

AppDataSource.initialize()
  .then(() => {
    const app = express();
    const distPath = path.join(__dirname, "../frontend/dist");

    app.use(express.static(distPath));
    app.use("/cards", cardsRouter);

    app.get("/", (_, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });

    const port = process.env.PORT || 8080;
    app.listen(port, () => {
      console.log(`Server started on port: ${port}`);
    });
  })
  .catch((err) => console.log(err));
