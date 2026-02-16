import { PrismaClient } from "../generated/prisma_client/client";
import { mockDeep, mockReset, DeepMockProxy } from "jest-mock-extended";

export const prismaMock = mockDeep<PrismaClient>();

jest.mock("../src/db", () => ({
  __esModule: true,
  prisma: prismaMock,
}));

beforeEach(() => {
  mockReset(prismaMock);
});

export const resetDatabase = async () => {
  await prismaMock.submission.deleteMany();
  await prismaMock.form.deleteMany();
};
