const express = require("express");

const app = express();
const port = process.env.PORT;

app.use((_, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.get("*", (req, res) => {
  res.send(mockingCase(req.query.text || ""));
});

app.listen(port, () => {
  console.log(`Sponge-mock service listening to port ${port}`);
});

function mockingCase(str) {
  return Array.from(str)
    .map((char) =>
      Math.round(Math.random()) ? char.toLowerCase() : char.toUpperCase()
    )
    .join("");
}
