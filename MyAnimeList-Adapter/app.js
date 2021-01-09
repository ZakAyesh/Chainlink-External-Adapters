const createRequest = require("./index").createRequest;
const { auth, cb, refreshAccessToken } = require("./oauth");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.EA_PORT || 8080;

app.use(bodyParser.json());

// Call this from the browser, while signed into myanimelist.net, to authorize the adapter.
app.get("/authorize", (req, res) => {
  auth(req, res);
});

// This will get called automatically once the adapter is authorized.
app.get("/callback", (req, res) => {
  cb(req, res);
});

// refresh() checks for expired accesstoken and automatically requests a new one if needed.
app.post("/", (req, res) => {
  console.log("POST Data: ", req.body);
  refreshAccessToken();
  createRequest(req.body, (status, result) => {
    console.log("Result: ", result);
    res.status(status).json(result);
  });
});

app.listen(port, () => console.log(`Listening on port ${port}!`));
