import crypto from "crypto";
import { prisma } from "../../db";
import { CreateFormInput } from "./form.schema";

export const FormService = {
  async createForm(data: CreateFormInput) {
    const manageKey = crypto.randomBytes(24).toString("hex");

    const form = await prisma.form.create({
      data: {
        name: data.name,
        ownerEmail: data.ownerEmail,
        manageKey,
      },
      select: {
        id: true,
        name: true,
        ownerEmail: true,
        manageKey: true,
        isActive: true,
        createdAt: true,
      },
    });

    return form;
  },

  async getFormById(id: string) {
    return prisma.form.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        isActive: true,
        createdAt: true,
      },
    });
  },
};
