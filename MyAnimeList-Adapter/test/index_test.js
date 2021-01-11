const assert = require("chai").assert;
const { createRequest, setBearerToken } = require("../index.js");

// Set your BearerToken in .envrc file before running tests.
// You can get the BearerToken by going through auth workflow in API and
// taking copying AccessToken.access_token from the console.
describe("createRequest", () => {
  const jobID = "1";

  context("successful calls", () => {
    const requests = [
      {
        name: "id not supplied",
        testData: { data: { ranking_type: "all", rank: "1" } },
      },
      {
        name: "ranking_type/rank",
        testData: { id: jobID, data: { ranking_type: "all", rank: "1" } },
      },
      {
        name: "type/ranking",
        testData: { id: jobID, data: { type: "all", ranking: "1" } },
      },
      {
        name: "anime_type/ranked",
        testData: { id: jobID, data: { anime_type: "all", ranked: "1" } },
      },
    ];

    setBearerToken(process.env.BEARER_TOKEN);

    requests.forEach((req) => {
      it(`${req.name}`, (done) => {
        createRequest(req.testData, (statusCode, data) => {
          assert.equal(statusCode, 200);
          assert.equal(data.jobRunID, jobID);
          assert.isNotEmpty(data.data);
          assert.isAbove(Number(data.result), 0);
          assert.isAbove(Number(data.data.result), 0);
          done();
        });
      });
    });
  });

  context("error calls", () => {
    const requests = [
      { name: "empty body", testData: {} },
      { name: "empty data", testData: { data: {} } },
      {
        name: "base not supplied",
        testData: { id: jobID, data: { quote: "USD" } },
      },
      {
        name: "quote not supplied",
        testData: { id: jobID, data: { base: "ETH" } },
      },
      {
        name: "unknown base",
        testData: { id: jobID, data: { base: "not_real", quote: "USD" } },
      },
      {
        name: "unknown quote",
        testData: { id: jobID, data: { base: "ETH", quote: "not_real" } },
      },
    ];

    requests.forEach((req) => {
      it(`${req.name}`, (done) => {
        createRequest(req.testData, (statusCode, data) => {
          assert.equal(statusCode, 500);
          assert.equal(data.jobRunID, jobID);
          assert.equal(data.status, "errored");
          assert.isNotEmpty(data.error);
          done();
        });
      });
    });
  });
});
