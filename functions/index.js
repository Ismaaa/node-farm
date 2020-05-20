const functions = require("firebase-functions");
const express = require("express");

const fs = require("fs");

function replaceTemplate(template, product) {
  // with the /{%NAME%}/g we make the replace global and it will replace all occurrences
  let output = template
    .replace(/{%ID%}/g, product.id)
    .replace(/{%NAME%}/g, product.name)
    .replace(/{%IMAGE%}/g, product.image)
    .replace(/{%FROM%}/g, product.from)
    .replace(/{%NUTRIENTS%}/g, product.nutrients)
    .replace(/{%QUANTITY%}/g, product.quantity)
    .replace(/{%PRICE%}/g, product.price)
    .replace(/{%DESCRIPTION%}/g, product.description);

  // Add non-organic class when prop organic is false
  if (!product.organic)
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");

  return output;
}

/** Load data */
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const jsonData = JSON.parse(data);

/** Load templates */
const cardView = fs.readFileSync(`${__dirname}/templates/card.html`, "utf-8");
const overviewView = fs.readFileSync(
  `${__dirname}/templates/overview.html`,
  "utf-8"
);
const productView = fs.readFileSync(
  `${__dirname}/templates/product.html`,
  "utf-8"
);

const app = express();

app.get("/", (req, res) => {
  // Replace all vars in all cards and join result so we can print it to the html
  const cards = jsonData
    .map((item) => replaceTemplate(cardView, item))
    .join("");

  // Replace cards placeholder for the partial
  const output = overviewView.replace("{%PRODUCT_CARDS%}", cards);

  res.set("Cache-Control", "public, max-age=31557600, s-maxage=31557600");
  res.send(output);
});
app.get("/overview", (req, res) => {
  // Replace all vars in all cards and join result so we can print it to the html
  const cards = jsonData
    .map((item) => replaceTemplate(cardView, item))
    .join("");

  // Replace cards placeholder for the partial
  const output = overviewView.replace("{%PRODUCT_CARDS%}", cards);

  res.set("Cache-Control", "public, max-age=31557600, s-maxage=31557600");
  res.send(output);
});

app.get("/product/:id", (req, res) => {
  const product = jsonData[parseInt(req.params.id, 10)];
  const output = replaceTemplate(productView, product);

  res.set("Cache-Control", "public, max-age=31557600, s-maxage=31557600");
  res.send(output);
});

app.get("/api", (req, res) => {
  res.set("Cache-Control", "public, max-age=31557600, s-maxage=31557600");
  res.send(data);
});

exports.app = functions.https.onRequest(app);
