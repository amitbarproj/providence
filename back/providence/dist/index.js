const express = require("express");
const app = express();
const http = require("http");
const https = require("https");
const cors = require("cors");
const { Server } = require("socket.io");
app.use(cors());
const projConf = require("../../../config/projConf.json");
const port = projConf.ProvidenceServer.port;
const server = projConf.ProvidenceServer.protocol === "https" ? https.createServer(app) : http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});
io.on("connection", (socket) => {
    console.log(`User Connected: ${socket}`);
});
app.get('/', (req, res) => {
    res.send('Hello World!');
});
server.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
//# sourceMappingURL=index.js.map