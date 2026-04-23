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

describe("GET /posts/ || Find all posts", () => {
  test("should return all posts", async () => {
    const res = await request(app).get("/posts/");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe("GET /posts/:userId || Find posts by user id", () => {
  test("should return all posts by user", async () => {
    const res = await request(app).get("/posts/1");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("should return 400 when invalid id", async () => {
    const res = await request(app).get("/posts/abc");

    expect(res.statusCode).toBe(400);
  });
});

describe("POST /posts/ || Create a post", () => {
  test("should create a post", async () => {
    const res = await request(app).post("/posts").send({ body: "test" });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("user_id");
    expect(res.body).toHaveProperty("body");
    expect(res.body).toHaveProperty("created_at");

    await pool.query("DELETE FROM posts where id = $1", [res.body.id]);
  });

  test("should fail with invalid body", async () => {
    const res = await request(app).post("/posts").send({ body: "" });

    expect(res.statusCode).toBe(400);
  });
});

describe("DELETE /posts || Delete a post", () => {
  test("should delete a post", async () => {
    const created = await request(app)
      .post("/posts")
      .send({ body: "to be deleted" });

    const res = await request(app).delete(`/posts/${created.body.id}`);

    expect(res.statusCode).toBe(204);

    await pool.query("DELETE FROM posts WHERE id = $1", [created.body.id]);
  });

  test("should fail on invalid id", async () => {
    const res = await request(app).delete(`/posts/abc`);

    expect(res.statusCode).toBe(400);
  });

  test("should fail if post not found", async () => {
    const res = await request(app).delete(`/posts/9999999`);

    expect(res.statusCode).toBe(404);
  });
});

describe("PATCH /posts/:id || Edit a post", () => {
  test("should edit a post", async () => {
    const created = await request(app)
      .post("/posts")
      .send({ body: "to be deleted" });

    const res = await request(app)
      .patch(`/posts/${created.body.id}`)
      .send({ body: "i added profile descriptions!" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("user_id");
    expect(res.body).toHaveProperty("body");
    expect(res.body).toHaveProperty("created_at");

    await pool.query("DELETE FROM posts WHERE id = $1", [created.body.id]);
  });

  test("should fail on invalid id", async () => {
    const res = await request(app).patch(`/posts/abc`).send("test");

    expect(res.statusCode).toBe(400);
  });

  test("should fail if invalid body", async () => {
    const created = await request(app).post("/posts").send({ body: "test" });

    const res = await request(app)
      .patch(`/posts/${created.body.id}`)
      .send({ body: "" });

    expect(res.statusCode).toBe(400);

    await pool.query("DELETE FROM posts WHERE id = $1", [created.body.id]);
  });
});

afterAll(async () => {
  await pool.end();
});
