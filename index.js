import { createServer } from "node:http";
import pug from "pug";

let compiledFunction;
const boot = async () => {
  try {
    const selectedThemeconfig = await fetch(
      "http://localhost:3000/get-theme-config",
    );
    const selectedThemeData = await selectedThemeconfig.json();

    const selectedThemeUrl =
      "./themes/" + selectedThemeData.themeUrl + "/views/index.pug";
    compiledFunction = pug.compileFile(selectedThemeUrl);
    await import("./themes/" + selectedThemeData.themeUrl + "/index.js");
  } catch (err) {
    console.log(err);
  }
};

boot();

const server = createServer((req, res) => {
  switch (req.url) {
    case "/":
      const html = compiledFunction({
        title: "Home Page",
        message: "Home Page Content",
      });
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(html);
      return;
    case "/about":
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end("<h1>About Us</h1>\n");
      return;
    case "/contact":
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end("<h1>Contact Us</h1>\n");
      return;
    case "/get-theme-config":
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ themeUrl: "2024" }));
      return;
    default:
      res.writeHead(404, { "Content-Type": "text/html" });
      res.end("<h1>404 Not Found</h1>\n");
      return;
  }
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000/");
});
