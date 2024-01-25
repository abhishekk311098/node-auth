const supertest = require("supertest");
const mongoose = require("mongoose");
const User = require("../Models/User");
const baseurl = process.env.BASE_URL || "http://localhost:8000";

describe("Register Controller", function () {
  let authToken;
  let userId;

  it("should successfully register a user", async () => {
    const response = await supertest(baseurl)
      .post("/api/v1/auth/register")
      .send({
        userName: "testuser",
        email: "testuser@example.com",
        password: "password123",
        confirmPassword: "password123",
      });
    const { expect } = await import("chai");
    expect(response.status).to.equal(201);
    expect(response.body).to.have.property("status").that.equals("Success");
    expect(response.body).to.have.property("data").that.has.property("user");

    const { user } = response.body.data;
    userId = user._id;
    expect(user).to.have.property("userName").that.equals("testuser");
    expect(user).to.have.property("email").that.equals("testuser@example.com");
    expect(user).to.not.have.property("password");
  });
  it("User Already exist", async () => {
    const response = await supertest(baseurl)
      .post("/api/v1/auth/register")
      .send({
        userName: "testuser",
        email: "testuser@example.com",
        password: "password123",
        confirmPassword: "password123",
      });
    const { expect } = await import("chai");

    expect(response.status).to.equal(400);
    expect(response.body)
      .to.have.property("message")
      .that.has.equals(
        `There is already a data with name testuser. Please use another name!`
      );
  });
  it("Login a user", async () => {
    const response = await supertest(baseurl).post("/api/v1/auth/login").send({
      userName: "testuser",
      password: "password123",
    });
    authToken = response.headers["set-cookie"];
    const { expect } = await import("chai");
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property("status").that.equals("success");
    expect(response.body).to.have.property("data").that.has.property("user");

    const { user } = response.body.data;
    expect(user).to.have.property("userName").that.equals("testuser");
    expect(user).to.have.property("email").that.equals("testuser@example.com");
    expect(user).to.not.have.property("password");
  });
  it("Login a user with wrong credientials", async () => {
    const response = await supertest(baseurl).post("/api/v1/auth/login").send({
      userName: "testuser2",
      password: "password123",
    });
    const { expect } = await import("chai");
    expect(response.status).to.equal(400);
    expect(response.body)
      .to.have.property("message")
      .that.equals("Incorrect email or password");
  });
  it("Logout with login", async () => {
    const response = await supertest(baseurl)
      .get("/api/v1/auth/logout")
      .set("Cookie", authToken);
    const { expect } = await import("chai");
    expect(response.status).to.equal(200);
    expect(response.body)
      .to.have.property("message")
      .that.equals("User logout successfully");
  });
  it("Logout without login", async () => {
    const response = await supertest(baseurl).get("/api/v1/auth/logout");
    const { expect } = await import("chai");
    expect(response.status).to.equal(401);
    expect(response.body)
      .to.have.property("message")
      .that.equals("Please login againg session is expired");
  });
  it("Update user password", async () => {
    const login = await supertest(baseurl).post("/api/v1/auth/login").send({
      userName: "testuser",
      password: "password123",
    });
    authToken = login.headers["set-cookie"];
    const response = await supertest(baseurl)
      .patch("/api/v1/auth/update-password")
      .send({
        currentPassword: "password123",
        password: "password1234",
        confirmPassword: "password1234",
      }).set("Cookie", authToken);
    const { expect } = await import("chai");
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property("status").that.equals("success");
    expect(response.body).to.have.property("message").that.equals("password updated successfully");

  });
  it("delete user", async () => {
    const login = await supertest(baseurl).post("/api/v1/auth/login").send({
      userName: "testuser",
      password: "password1234",
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
