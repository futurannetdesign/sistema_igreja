const request = require("supertest");
const chai = require("chai");
const expect = chai.expect;
const app = require("../backend/server"); // Certifique-se de exportar o app no server.js

describe("GET /api/members", () => {
  it("deve retornar um array de membros", async () => {
    const res = await request(app).get("/api/members");
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array");
  });
});

// Outros testes (POST, PUT, DELETE) devem ser implementados conforme os endpoints
