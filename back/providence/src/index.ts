import { Main } from "./services/main";
import { SocketServer } from "./services/socketServer";

const express = require("express");
const path = require("path");
const app = express();
const http = require("http");
const https = require("https");
const cors = require("cors");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(express.static(path.join("../../../../public")));

//Comment this app.use in local
app.use(express.static(path.join("../../../../build")));

const servicesConf = require("../../../../../../config/services.json");
const port = servicesConf.Server.port;
const server =
  servicesConf.Server.protocol === "https"
    ? https.createServer(app)
    : http.createServer(app);

server.listen(port, () => {
  console.log(`Server listening on porr ${port}`);
  initAllServices();

  //Comment this app.get in local
  app.get("/*/", (req, res) => {
    res.sendFile("index.html", {
      root: path.join(__dirname, "../../../../build"),
    });
  });
});

const initAllServices = () => {
  SocketServer.init(server);
  Main.init(app);
};
