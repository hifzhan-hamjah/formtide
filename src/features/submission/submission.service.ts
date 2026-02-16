import { get } from "node:http";
import { prisma } from "../../db";

export const SubmissionsService = {
  async createSubmission(
    formId: string,
    body: any,
    ip: string,
    userAgent: string | null,
  ) {
    const form = await prisma.form.findUnique({
      where: { id: formId },
      select: { id: true, isActive: true },
    });

    if (!form) throw { status: 404, message: "Form not found" };
    if (!form.isActive) throw { status: 403, message: "Form is disabled" };

    if (body?._bot) return null;

    const submission = await prisma.submission.create({
      data: {
        formId,
        payload: body,
        ip,
        userAgent,
      },
      select: { id: true, createdAt: true },
    });

    return submission;
  },

  async getSubmission(formId: string, key?: string) {
    if (!key) throw { status: 401, message: "Missing key" };

    const form = await prisma.form.findUnique({
      where: { id: formId },
      select: { manageKey: true },
    });

    if (!form) throw { status: 404, message: "Form not found" };
    if (form.manageKey !== key) throw { status: 403, message: "Invalid key" };

    const submissions = await prisma.submission.findMany({
      where: { formId },
      orderBy: { createdAt: "desc" },
      take: 100,
      select: {
        id: true,
        payload: true,
        ip: true,
        userAgent: true,
        createdAt: true,
      },
    });

    return submissions;
  },
};
