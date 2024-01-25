const supertest = require("supertest");
const baseurl = process.env.BASE_URL || "http://localhost:8000";

describe("Users Controller", function () {
  let authToken;
  let id;

  before(async () => {
    const register = await supertest(baseurl)
      .post("/api/v1/auth/register")
      .send({
        userName: "testuser3",
        email: "testuser3@example.com",
        password: "password123",
        confirmPassword: "password123",
      });

    const login = await supertest(baseurl).post("/api/v1/auth/login").send({
      userName: "testuser3",
      password: "password123",
    });
    authToken = login.headers["set-cookie"];
    this.timeout = 5000;
  });

  it("Updates user details with role", async () => {
    const response = await supertest(baseurl)
      .patch("/api/v1/users/update-user")
      .send({
        firstName: "test",
        lastName: "tester",
        role: "admin",
      })
      .set("Cookie", authToken);
    const { expect } = await import("chai");
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property("status").that.equals("success");
    expect(response.body)
      .to.have.property("message")
      .that.equals("user updated successfully");
  });
  it("delete user", async () => {
    const login = await supertest(baseurl).post("/api/v1/auth/login").send({
      userName: "testuser3",
      password: "password123",
    });
    authToken = login.headers["set-cookie"];
    const response = await supertest(baseurl)
      .delete("/api/v1/users")
      .set("Cookie", authToken);
    const { expect } = await import("chai");
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property("status").that.equals("success");
    expect(response.body)
      .to.have.property("message")
      .that.equals("user deleted successfully");
  });
});
