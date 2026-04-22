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

describe("GET /likes/user/:userId || Find likes by user id", () => {
  test("should return likes by user id", async () => {
    const res = await request(app).get("/likes/user/1");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("should return 400 for invalid id", async () => {
    const res = await request(app).get("/likes/user/abc");

    expect(res.statusCode).toBe(400);
  });
});

describe("GET /likes/post/:postId || Find likes count on post", () => {
  test("should return likes by user id", async () => {
    const res = await request(app).get("/likes/post/1");

    expect(res.statusCode).toBe(200);
    expect(res.body[0]).toHaveProperty("count");
  });

  test("should return 400 for invalid id", async () => {
    const res = await request(app).get("/likes/post/abc");

    expect(res.statusCode).toBe(400);
  });
});

describe("GET /likes/post/:postId/user/userId || Find if user has liked a post", () => {
  test("should return boolean", async () => {
    const res = await request(app).get("/likes/post/1/user/1");

    expect(res.statusCode).toBe(200);
    expect(typeof res.body).toBe("boolean");
  });

  test("should return 400 for invalid user id", async () => {
    const res = await request(app).get("/likes/post/1/user/abc");

    expect(res.statusCode).toBe(400);
  });

  test("should return 400 for invalid post id", async () => {
    const res = await request(app).get("/likes/post/abc/user/1");

    expect(res.statusCode).toBe(400);
  });
});

describe("POST /likes || Create a like", () => {
  test("should create a like", async () => {
    const res = await request(app).post("/likes").send({ post_id: 2 });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("post_id");
    expect(res.body).toHaveProperty("user_id");
  });

  test("should fail with invalid post id", async () => {
    const res = await request(app).post("/likes").send({ post_id: "abc" });

    expect(res.statusCode).toBe(400);
  });
});

describe("DELETE /likes || Remove a like", () => {
  test("should remove a like", async () => {
    const res = await request(app).delete("/likes/post/2");

    expect(res.statusCode).toBe(204);
  });

  test("should fail with invalid post id", async () => {
    const res = await request(app)
      .delete("/likes/post/2")
      .send({ post_id: "abc" });

    expect(res.statusCode).toBe(404);
  });
});
