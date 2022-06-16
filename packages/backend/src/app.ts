import express from "express";
import path from "path";

const app = express();
const distPath = path.join(__dirname, "../../frontend/dist");

app.use(express.static(distPath));

app.get("/", (_, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});
