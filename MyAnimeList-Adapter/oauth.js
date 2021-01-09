const { setBearerToken } = require("./index");
const randomstring = require("randomstring");
const { AuthorizationCode } = require("simple-oauth2");

let code_verifier = randomstring.generate(100);
let accessToken;
let authCode;
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
  authCode = req.query.code;
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
    accessToken = await client.getToken(tokenParams, { json: true });
    refreshToken = accessToken.token.refresh_token;
    console.log("Access Token is: ", accessToken);
    setBearerToken(accessToken.token.access_token);
  } catch (error) {
    console.log("Access Token Error", error);
    console.log("Access Token Error", error.message);
  }
};

const refreshAccessToken = async () => {
  if (accessToken.expired()) {
    try {
      const refreshParams = {
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      };
      accessToken = await accessToken.refresh(refreshParams);
      console.log("Refreshed Access Token is: ", accessToken);
      refreshToken = accessToken.token.refresh_token;
      setBearerToken(accessToken.token.access_token);
    } catch (error) {
      console.log("Error refreshing access token: ", error.message);
    }
  } else {
    console.log("Access Token has not expired.");
  }
};

module.exports.auth = auth;
module.exports.cb = cb;
module.exports.refreshAccessToken = refreshAccessToken;
