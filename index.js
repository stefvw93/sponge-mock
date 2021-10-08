const express = require("express");
const { createCanvas, loadImage } = require("canvas");

// server
const app = express();
const port = process.env.PORT;

// canvas settings
const outputSize = [512, 512];
const imageSize = [512, 356];
const fontSize = 30;
const lineHeight = fontSize * 1.5;
const font = "Arial";
const padding = 20;
const canvas = createCanvas(...outputSize);
const ctx = canvas.getContext("2d");

service();

async function service() {
  /**
   * template image 640x445
   */
  const image = await loadImage("./mocking-spongebob.jpeg");

  // prepare canvas

  ctx.drawImage(image, 0, 0, imageSize[0], imageSize[1]);
  ctx.font = `${fontSize}px ${font}`;

  // server stuff

  app.use((_, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
  });

  app.get("*", (req, res) => {
    const text = mockingCase(req.params[0].slice(1) || "");

    if ("text" in req.query) {
      return res.send({ text });
    }

    // clear text area

    ctx.fillStyle = "#fff";
    ctx.fillRect(0, imageSize[1], outputSize[0], outputSize[1]);

    // set text color & write text

    ctx.fillStyle = "#000";

    getTextLines(text, outputSize[1] - padding * 2).forEach((line, index) => {
      ctx.fillText(line, padding, imageSize[1] + (index + 1) * lineHeight);
    });

    // return file

    canvas.toBuffer(
      (error, buffer) => {
        if (error) return res.end();
        res.write(buffer, "binary");
        res.end(null, "binary");
      },
      "image/jpeg",
      { quality: 0.5 }
    );
  });

  app.listen(port, () => {
    console.log(`Sponge-mock service listening to port ${port}`);
  });
}

function mockingCase(str) {
  return Array.from(str)
    .map((char) =>
      Math.round(Math.random()) ? char.toLowerCase() : char.toUpperCase()
    )
    .join("");
}

function getTextLines(text, maxWidth) {
  const words = text.split(" ");
  const lines = [];
  let currentLine = words[0];
  let word;
  let width;

  for (let i = 1; i < words.length; i++) {
    word = words[i];
    width = ctx.measureText([currentLine, word].join(" ")).width;

    if (width < maxWidth) {
      currentLine += " " + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }

  lines.push(currentLine);

  return lines;
}
