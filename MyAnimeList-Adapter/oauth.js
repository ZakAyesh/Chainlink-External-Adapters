const setBearerToken = require("./index").setBearerToken;
const randomstring = require("randomstring");
const { AuthorizationCode } = require("simple-oauth2");

let code_verifier = randomstring.generate(100);

let bearerToken;
let refreshToken;

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

const auth = async (req, res) => {
  console.log("Getting authorization code.");

  const authorizationUri = client.authorizeURL({
    code_challenge: code_verifier,
    redirect_uri: "http://localhost:8080/callback",
    code_challenge_method: "plain",
  });

  res.redirect(authorizationUri);
};

const cb = async (req, res) => {
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
    console.log("Access Token is: ", accessToken);
    setBearerToken(accessToken.token.access_token);
  } catch (error) {
    console.log("Access Token Error", error);
    console.log("Access Token Error", error.message);
  }
};

module.exports.auth = auth;
module.exports.cb = cb;
