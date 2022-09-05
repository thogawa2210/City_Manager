const http = require('http');
const port = 3000;
const url = require('url');
const Controller = require("./src/controller");
const fs = require("fs");

const controller = new Controller();

const mimeTypes = {
    "html": "text/html",
    "js": "text/javascript",
    "css": "text/css",
    "png": "image/png",
    "jpg": "image/jpeg"
};

const httpServer = http.createServer((req, res) => {
    const filesDefences = req.url.match(/\.js|.css|\.png|\.jpg/);
    if (filesDefences) {
        const extension = mimeTypes[filesDefences[0].toString().split('.')[1]];
        res.writeHead(200, { 'Content-Type': extension });
        fs.createReadStream(__dirname + "/" + req.url).pipe(res);
    }

    const urlPath = url.parse(req.url);

    switch (urlPath.pathname) {
        case '/':
            controller.home(req, res).then(r => {});
            break;
        case '/add':
            controller.add(req, res);
            break;
        case '/city':
            controller.city(req, res).then(r => {});
            break;
        case '/update':
            controller.update(req, res).then(r => {});
            break;
        case '/delete':
            controller.delete(req, res).then(r => {});
            break;
        default:
            res.end();
            break;
    }
})

httpServer.listen(port, 'localhost', () => {
    console.log(`Server is running at http://localhost:${port}`);
});
