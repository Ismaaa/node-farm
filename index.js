const fs = require("fs");
const http = require("http");
const url = require("url");

const replaceTemplate = require("./modules/replaceTemplate");

/////////////////////////////////
// FILES

// Blocking, synchronous way
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(textIn);
// const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt', textOut);
// console.log('File written!');

// Non-blocking, asynchronous way
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//   if (err) return console.log('ERROR! 💥');

//   fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//     console.log(data2);
//     fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//       console.log(data3);

//       fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
//         console.log('Your file has been written 😁');
//       })
//     });
//   });
// });
// console.log('Will read file!');

/////////////////////////////////////////////////////////
// SERVER

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

/** Server - Everything inside this function will run on every request */
const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  // Overview page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(404, {
      "Content-type": "text/html",
    });

    // Replace all vars in all cards and join result so we can print it to the html
    const cards = jsonData
      .map((item) => replaceTemplate(cardView, item))
      .join("");

    // Replace cards placeholder for the partial
    const output = overviewView.replace("{%PRODUCT_CARDS%}", cards);

    res.end(output);

    // Product page
  } else if (pathname === "/product") {
    const product = jsonData[query.id];

    const output = replaceTemplate(productView, product);

    res.writeHead(404, {
      "Content-type": "text/html",
    });
    res.end(output);

    // Api
  } else if (pathname === "/api") {
    res.writeHead(200, {
      "Content-type": "application/json",
    });
    res.end(data);

    // 404
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
    });
    res.end("<h1>Page not found !</h1>");
  }
});

server.listen(8080, "127.0.0.1", () => {
  console.log("Listening on port 8080");
});
