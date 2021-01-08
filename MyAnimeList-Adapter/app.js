const createRequest = require("./index").createRequest;
const { auth, cb } = require("./oauth");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.EA_PORT || 8080;

app.use(bodyParser.json());

app.get("/authorize", (req, res) => {
  auth(req, res);
});

app.get("/callback", (req, res) => {
  cb(req, res);
});

app.post("/", (req, res) => {
  console.log("POST Data: ", req.body);
  createRequest(req.body, (status, result) => {
    console.log("Result: ", result);
    res.status(status).json(result);
  });
});

app.listen(port, () => console.log(`Listening on port ${port}!`));
