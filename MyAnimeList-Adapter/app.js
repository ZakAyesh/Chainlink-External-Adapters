const createRequest = require("./index").createRequest;
var bearerToken = require("./index").bearerToken;
const randomstring = require("randomstring");
const { AuthorizationCode } = require("simple-oauth2");

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.EA_PORT || 8080;

var code_verifier = randomstring.generate(100);

const config = {
  client: {
    id: process.env.CLIENT_ID,
    secret: process.env.CLIENT_SECRET,
  },
  auth: {
    tokenHost: "https://myanimelist.net/",
    authorizePath: "v1/oauth2/authorize",
    tokenPath: "v1/oauth2/token",
  },
};

const client = new AuthorizationCode(config);

app.use(bodyParser.json());

app.get("/authorize", async (req, res) => {
  console.log("Getting authorization code.");

  const authorizationUri = client.authorizeURL({
    code_challenge: code_verifier,
    redirect_uri: "http://localhost:8080/callback",
    code_challenge_method: "plain",
  });

  res.redirect(authorizationUri);
});

app.get("/callback", async (req, res) => {
  const tokenParams = {
    code: req.query.code,
    client_secret: config.client.secret,
    client_id: config.client.id,
    grant_type: "authorization_code",
    code_verifier: code_verifier,
    redirect_uri: "http://localhost:8080/callback",
  };

  console.log("Authorization Code: ", req.query.code);

  try {
    const accessToken = await client.getToken(tokenParams, { json: true });
    bearerToken = accessToken;
    console.log("Access Token is: ", accessToken);
  } catch (error) {
    console.log("Access Token Error", error);
    console.log("Access Token Error", error.message);
  }
});

app.post("/", (req, res) => {
  console.log("POST Data: ", req.body);
  createRequest(req.body, (status, result) => {
    console.log("Result: ", result);
    res.status(status).json(result);
  });
});

app.listen(port, () => console.log(`Listening on port ${port}!`));
