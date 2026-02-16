import request from "supertest";
import { prisma } from "../../db";
import { resetDatabase } from "../../../test/setup";
import { createApp } from "../../app";

jest.mock("../../db", () => ({
  prisma: {
    form: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}));

describe("Form Routes", () => {
  beforeEach(async () => {
    await resetDatabase();
  });
  it("POST /forms should create a form", async () => {
    (prisma.form.create as jest.Mock).mockResolvedValue({
      id: "123",
      name: "Test Form",
      ownerEmail: "test@example.com",
      manageKey: "abc",
      isActive: true,
      createdAt: new Date(),
    });

    const res = await request(createApp())
      .post("/api/forms")
      .send({ name: "Test Form", ownerEmail: "test@example.com" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id", "123");
    expect(res.body).toHaveProperty("manageKey", "abc");
  });
});
