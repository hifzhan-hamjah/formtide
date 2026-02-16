import { FormService } from "./form.service";
import { prisma } from "../../db";
import { resetDatabase } from "../../../test/setup";

jest.mock("../../db", () => ({
  prisma: {
    form: {
      create: jest.fn(),
    },
  },
}));

describe("FormService", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  it("should create a form with manageKey", async () => {
    (prisma.form.create as jest.Mock).mockResolvedValue({
      id: "123",
      name: "Test Form",
      ownerEmail: "test@example.com",
      manageKey: "abc",
      isActive: true,
      createdAt: new Date(),
    });

    const form = await FormService.createForm({
      name: "Test Form",
      ownerEmail: "test@example.com",
    });

    expect(form).toHaveProperty("id", "123");
    expect(form).toHaveProperty("manageKey", "abc");
  });
});
