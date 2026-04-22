const request = require("supertest");
const app = require("../app");
const { pool } = require("../database/db");

jest.mock("../middleware/auth", () => ({
  checkAuthenticated: (req, res, next) => {
    req.user = { id: 1 };
    next();
  },
  checkNotAuthenticated: (req, res, next) => next(),
  checkAuthenticationForUD: (req, res, next) => next(),
}));

describe("GET /users || Find all users", () => {
  test("should respond with a 200 status code", async () => {
    const response = await request(app).get("/users");
    expect(response.statusCode).toBe(200);
  });

  test("should specify json in the content type header", async () => {
    const response = await request(app).get("/users");
    expect(response.headers["content-type"]).toEqual(
      expect.stringContaining("json"),
    );
  });
});

describe("GET /users/:id || Find user by ID", () => {
  test("should return user by id", async () => {
    const id = 1;
    const res = await request(app).get(`/users/${id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("username");
  });

  test("should return 400 for invalid id", async () => {
    const id = "abcd";
    const res = await request(app).get(`/users/${id}`);

    expect(res.statusCode).toBe(400);
  });
});

describe("POST /users/register || Create new user", () => {
  test("should create user", async () => {
    const res = await request(app)
      .post("/users/register")
      .send({
        username: `test-${Date.now()}`,
        password: "Abcd1234",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("password");
  });

  test("should fail on invalid username (/^[a-zA-Z0-9.-]+$/, 4-20 chars)", async () => {
    const res = await request(app).post("/users/register").send({
      username: "***",
      password: "Abcd1234",
    });

    expect(res.statusCode).toBe(400);
  });

  test("should fail on invalid password (/A-Z/ + /a-z/ + /0-9/, 8-30 chars)", async () => {
    const res = await request(app)
      .post("/users/register")
      .send({
        username: `test-${Date.now()}`,
        password: "...",
      });

    expect(res.statusCode).toBe(400);
  });

  afterEach(async () => {
    await pool.query("DELETE FROM users WHERE username LIKE 'test-%'");
  });
});

describe("POST /users/login || Login user", () => {
  test("should login user", async () => {
    const res = await request(app).post("/users/login").send({
      username: "guider",
      password: "guider",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Login successful");
    expect(res.body.user).toHaveProperty("id");
    expect(res.body.user).toHaveProperty("username");
  });

  test("should fail with wrong username", async () => {
    const res = await request(app).post("/users/login").send({
      username: "wrong",
      password: "guider",
    });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("message");
  });

  test("should fail with wrong password", async () => {
    const res = await request(app).post("/users/login").send({
      username: "guider",
      password: "wrong",
    });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("message");
  });
});

describe("GET /users/loggedin || get logged in users id", () => {
  test("should return logged in users id", async () => {
    const res = await request(app).get("/users/loggedin");

    expect(res.statusCode).toBe(200);
  });
});

describe("DELETE /users/logout || logout user", () => {
  test("should logout user", async () => {
    const res = await request(app).delete("/users/logout");

    expect(res.statusCode).toBe(200);
  });
});

describe("PATCH /users/description || Edit description of the profile", () => {
  test("should update description", async () => {
    const res = await request(app).patch("/users/description").send({
      description:
        "description will be visible after editing it once. it can also be empty",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("description");
  });
});
