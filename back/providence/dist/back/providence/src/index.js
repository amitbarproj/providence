"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("./services/main");
const socketServer_1 = require("./services/socketServer");
const express = require("express");
const path = require("path");
const app = express();
const http = require("http");
const https = require("https");
const cors = require("cors");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(express.static(path.join('../../../../public')));
app.use(express.static(path.join('../../../../build')));
app.get('*', function (req, res) {
    res.sendFile('index.html', { root: path.join(__dirname, '../../../../build') });
});
const servicesConf = require("../../../../../../config/services.json");
const port = servicesConf.Server.port;
const server = servicesConf.Server.protocol === "https" ? https.createServer(app) : http.createServer(app);
server.listen(port, () => {
    console.log(`Server listening on porr ${port}`);
    initAllServices();
});
const initAllServices = () => {
    socketServer_1.SocketServer.init(server);
    main_1.Main.init(app);
};
//# sourceMappingURL=index.js.map