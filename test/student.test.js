const supertest = require("supertest");
const baseurl = process.env.BASE_URL || "http://localhost:8000";

describe("Student Controller", function () {
  let authToken;
  let id;
  before(async () => {
    const register = await supertest(baseurl)
      .post("/api/v1/auth/register")
      .send({
        userName: "testuser1",
        email: "testuser1@example.com",
        password: "password123",
        confirmPassword: "password123",
      }); 
    let login = await supertest(baseurl).post("/api/v1/auth/login").send({
      userName: "testuser1",
      password: "password123",
    });
    authToken = login.headers["set-cookie"];
    const response = await supertest(baseurl)
      .patch("/api/v1/users/update-user")
      .send({
        firstName: "test",
        lastName: "tester",
        role: "admin",
      })
      .set("Cookie", authToken);
    login = await supertest(baseurl).post("/api/v1/auth/login").send({
      userName: "testuser1",
      password: "password123",
    });
    authToken = login.headers["set-cookie"];
    this.timeout = 5000;
  });
  it("get all Students with login", async () => {
    const response = await supertest(baseurl)
      .get("/api/v1/students")
      .set("Cookie", authToken);
    const { expect } = await import("chai");
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property("status").that.equals("success");
    expect(response.body)
      .to.have.property("data")
      .that.has.property("students");

    const { students } = response.body.data;
    expect(students).to.be.an("array").that.is.not.empty;
    students.forEach((student) => {
      expect(student).to.have.property("userName").that.is.a("string");
      expect(student).to.have.property("email").that.is.a("string");
    });
  });
  it("get all Students without login", async () => {
    const response = await supertest(baseurl).get("/api/v1/students");
    const { expect } = await import("chai");
    expect(response.status).to.equal(401);
    expect(response.body).to.have.property("status").that.equals(401);
    expect(response.body)
      .to.have.property("message")
      .that.equals("Please login againg session is expired");
  });
  it("create a new student", async () => {
    const response = await supertest(baseurl)
      .post("/api/v1/students")
      .send({
        firstName: "test",
        lastName: "student",
        userName: "test3211",
        email: "test@mail.com",
        skills: ["swim", "martial arts"],
        courses: ["English", "Maths"],
      })
      .set("Cookie", authToken);
    const { expect } = await import("chai");
    expect(response.status).to.equal(201);
    expect(response.body).to.have.property("status").that.equals("success");
    expect(response.body).to.have.property("data").that.has.property("student");

    const { student } = response.body.data;
    id = student._id;
    expect(student).to.have.property("userName").that.is.a("string");
    expect(student).to.have.property("firstName").that.is.a("string");
    expect(student).to.have.property("lastName").that.is.a("string");
    expect(student).to.have.property("skills").that.is.a("array");
    expect(student).to.have.property("courses").that.is.a("array");
    expect(student).to.have.property("email").that.is.a("string");
  });
  it("delete student with id", async () => {
    const response = await supertest(baseurl)
      .delete(`/api/v1/students/${id}`)
      .set("Cookie", authToken);

    const { expect } = await import("chai");
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property("status").that.equals("success");
    expect(response.body)
      .to.have.property("message")
      .that.equals("Student deleted successfully");
  });
  it("delete student with wrong id", async () => {
    const response = await supertest(baseurl)
      .delete(`/api/v1/students/${id}`)
      .set("Cookie", authToken);
    const { expect } = await import("chai");
    expect(response.status).to.equal(500);
    expect(response.body).to.have.property("status").that.equals(500);
    expect(response.body)
      .to.have.property("message")
      .that.equals("Unable to delete Student, Student doesn't Exist");
  });
  it("delete user", async () => {
    const login = await supertest(baseurl).post("/api/v1/auth/login").send({
      userName: "testuser1",
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
