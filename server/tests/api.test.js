import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let app;
let httpServer;
let mongoServer;

let authToken;
let boardId;
let taskId;
let assigneeUserId;

const waitForMongoConnection = async () => {
  if (mongoose.connection.readyState === 1) return;

  await new Promise((resolve, reject) => {
    const timeout = setTimeout(
      () => reject(new Error("MongoDB connection timed out in tests")),
      10000
    );

    mongoose.connection.once("connected", () => {
      clearTimeout(timeout);
      resolve();
    });

    mongoose.connection.once("error", (err) => {
      clearTimeout(timeout);
      reject(err);
    });
  });
};

const clearDatabase = async () => {
  const collections = mongoose.connection.collections;
  await Promise.all(
    Object.values(collections).map((collection) => collection.deleteMany({}))
  );
};

describe("TaskFlow API - Basic Coverage", () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    process.env.MONGO_URI = mongoServer.getUri();
    process.env.DB_NAME = "taskflow_test";
    process.env.JWT_SECRET = process.env.JWT_SECRET || "taskflow_test_secret";

    const appModule = await import("../src/index.js");
    app = appModule.default;
    httpServer = appModule.httpServer;

    await waitForMongoConnection();
    await clearDatabase();
  }, 60000);

  afterAll(async () => {
    await clearDatabase();
    await mongoose.connection.close();
    if (mongoServer) {
      await mongoServer.stop();
    }
    await new Promise((resolve) => httpServer.close(resolve));
  }, 30000);

  test("POST /api/auth/signup should create user and return token", async () => {
    const payload = {
      name: "Primary Tester",
      email: `primary_${Date.now()}@example.com`,
      password: "Password@123",
    };

    const res = await request(app).post("/api/auth/signup").send(payload);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("user");
    expect(res.body.user.email).toBe(payload.email);
    expect(res.body.user).toHaveProperty("_id");

    authToken = res.body.token;
  });

  test("POST /api/auth/login should login user and return token", async () => {
    const email = `login_${Date.now()}@example.com`;
    const password = "Password@123";

    await request(app).post("/api/auth/signup").send({
      name: "Login Tester",
      email,
      password,
    });

    const res = await request(app).post("/api/auth/login").send({
      email,
      password,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user.email).toBe(email);
  });

  test("POST /api/boards should create board with JWT", async () => {
    const res = await request(app)
      .post("/api/boards")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ title: "Interview Board" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.title).toBe("Interview Board");
    expect(Array.isArray(res.body.members)).toBe(true);

    boardId = res.body._id;
  });

  test("POST /api/tasks should create task", async () => {
    const listRes = await request(app)
      .post("/api/lists")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        title: "To Do",
        boardId,
      });

    expect(listRes.statusCode).toBe(200);
    expect(listRes.body).toHaveProperty("_id");

    const taskRes = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        title: "Create API tests",
        description: "Basic endpoint coverage",
        boardId,
        listId: listRes.body._id,
      });

    expect(taskRes.statusCode).toBe(200);
    expect(taskRes.body).toHaveProperty("_id");
    expect(taskRes.body.title).toBe("Create API tests");
    expect(taskRes.body.boardId).toBe(boardId);

    taskId = taskRes.body._id;
  });

  test("PUT /api/tasks/assign should assign task to user", async () => {
    const assigneeRes = await request(app).post("/api/auth/signup").send({
      name: "Assignee User",
      email: `assignee_${Date.now()}@example.com`,
      password: "Password@123",
    });

    expect(assigneeRes.statusCode).toBe(200);
    assigneeUserId = assigneeRes.body.user._id;

    const res = await request(app)
      .put("/api/tasks/assign")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        taskId,
        userId: assigneeUserId,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("_id");
    expect(res.body).toHaveProperty("assignedTo");
    expect(res.body.assignedTo._id).toBe(assigneeUserId);
  });
});
