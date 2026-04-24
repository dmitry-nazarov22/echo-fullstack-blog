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

describe("GET /comments/user/:userId || Find comments by user", () => {
  test("should return all comments by user", async () => {
    const res = await request(app).get("/comments/user/1");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("should return 400 when invalid id", async () => {
    const res = await request(app).get("/comments/user/abc");

    expect(res.statusCode).toBe(400);
  });
});

describe("GET /comments/post/:postId || Find comments by post", () => {
  test("should return all comments by user", async () => {
    const res = await request(app).get("/comments/post/2");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("should return 400 when invalid id", async () => {
    const res = await request(app).get("/comments/post/abc");

    expect(res.statusCode).toBe(400);
  });
});

describe("GET /comments/post/first/:postId || Find latest comment for the post", () => {
  test("should return all comments by user", async () => {
    const res = await request(app).get("/comments/post/first/2");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("should return 400 when invalid id", async () => {
    const res = await request(app).get("/comments/post/first/abc");

    expect(res.statusCode).toBe(400);
  });
});

describe("DELETE /comments/:id || Delete a comment", () => {
  test("should delete a comment", async () => {
    const created = await request(app)
      .post("/comments")
      .send({ post_id: 1, body: "to be deleted" });

    const res = await request(app).delete(`/comments/${created.body.id}`);

    expect(res.statusCode).toBe(204);

    await pool.query("DELETE FROM comments WHERE id = $1", [created.body.id]);
  });

  test("should fail on invalid id", async () => {
    const res = await request(app).delete(`/comments/abc`);

    expect(res.statusCode).toBe(400);
  });

  test("should fail if comment not found", async () => {
    const res = await request(app).delete(`/comments/9999999`);

    expect(res.statusCode).toBe(404);
  });
});

describe("POST /comments/ || Create a comment", () => {
  test("should create a comment", async () => {
    const res = await request(app)
      .post("/comments")
      .send({ post_id: 1, body: "test" });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("user_id");
    expect(res.body).toHaveProperty("post_id");
    expect(res.body).toHaveProperty("body");
    expect(res.body).toHaveProperty("created_at");

    await pool.query("DELETE FROM comments where id = $1", [res.body.id]);
  });

  test("should fail on invalid id", async () => {
    const res = await request(app)
      .post("/comments")
      .send({ post_id: "abc", body: "test" });

    expect(res.statusCode).toBe(400);
  });

  test("should fail with invalid body", async () => {
    const res = await request(app)
      .post("/comments")
      .send({ post_id: 1, body: "" });

    expect(res.statusCode).toBe(400);
  });
});

describe("PATCH /comments/:id || Edit a comment", () => {
  test("should edit a post", async () => {
    const created = await request(app)
      .post("/comments")
      .send({ post_id: 1, body: "test" });

    const res = await request(app)
      .patch(`/comments/${created.body.id}`)
      .send({ body: "updated text" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("user_id");
    expect(res.body).toHaveProperty("post_id");
    expect(res.body).toHaveProperty("body");
    expect(res.body).toHaveProperty("created_at");

    await pool.query("DELETE FROM comments WHERE id = $1", [created.body.id]);
  });

  test("should fail on invalid id", async () => {
    const res = await request(app)
      .patch(`/comments/abc`)
      .send({ body: "test" });

    expect(res.statusCode).toBe(400);
  });

  test("should fail if invalid body", async () => {
    const created = await request(app)
      .post("/comments")
      .send({ post_id: 1, body: "test" });

    const res = await request(app)
      .patch(`/comments/${created.body.id}`)
      .send({ body: "" });

    expect(res.statusCode).toBe(400);

    await pool.query("DELETE FROM comments WHERE id = $1", [created.body.id]);
  });
});
