import { CorsOptions } from "cors";
import { Main } from "./services/main";
import { SocketServer } from "./services/socketServer";

const express = require("express");
const app = express();
const http = require("http");
const https = require("https");
const cors = require("cors");
app.use(express.urlencoded({extended: true}));
app.use(express.json());




app.use(cors());
const projConf = require("../../../../../../config/projConf.json");
const port  = projConf.ProvidenceServer.port;
const server = projConf.ProvidenceServer.protocol === "https" ? https.createServer(app) :http.createServer(app);


server.listen(port, () => {
    console.log(`Providence server listening on porr ${port}`)
    initAllServices();
  })


const initAllServices = () => {
    SocketServer.init(server);
    Main.init(app);
}