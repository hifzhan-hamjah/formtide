import { Router } from "express";
import { z } from "zod";
import crypto from "crypto";
import { prisma } from "../db";

export const formsRouter = Router();

const createFormSchema = z.object({
  name: z.string().min(1),
  ownerEmail: z.string().email().optional(),
});

formsRouter.post("/", async (req, res) => {
  const parsed = createFormSchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ error: "Invalid input", details: parsed.error.flatten() });
  }

  const manageKey = crypto.randomBytes(24).toString("hex");

  const form = await prisma.form.create({
    data: {
      name: parsed.data.name,
      ownerEmail: parsed.data.ownerEmail,
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

  const baseUrl =
    process.env.BASE_URL ?? `http://localhost:${process.env.PORT ?? 3000}`;

  return res.json({
    ...form,
    submitUrl: `${baseUrl}/api/forms/${form.id}/submissions`,
    submissionsUrl: `${baseUrl}/api/forms/${form.id}/submissions?key=${form.manageKey}`,
  });
});

formsRouter.get("/:id", async (req, res) => {
  const { id } = req.params;

  const form = await prisma.form.findUnique({
    where: { id },
    select: { id: true, name: true, isActive: true, createdAt: true },
  });

  if (!form) return res.status(404).json({ error: "Form not found" });
  return res.json(form);
});
