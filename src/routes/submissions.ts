import { Router } from "express";
import { prisma } from "../db";

export const submissionsRouter = Router();

submissionsRouter.post("/:id/submissions", async (req, res) => {
  const { id: formId } = req.params;

  const form = await prisma.form.findUnique({
    where: { id: formId },
    select: { id: true, isActive: true },
  });

  if (!form) return res.status(404).json({ error: "Form not found" });
  if (!form.isActive)
    return res.status(403).json({ error: "Form is disabled" });

  const body: any = req.body ?? {};

  // Honeypot: hidden field bots fill
  if (body?._bot) return res.status(200).json({ success: true });

  const submission = await prisma.submission.create({
    data: {
      formId,
      payload: body,
      ip: req.ip,
      userAgent: req.headers["user-agent"] ?? null,
    },
    select: { id: true, createdAt: true },
  });

  return res.json({
    success: true,
    submissionId: submission.id,
    createdAt: submission.createdAt,
  });
});

submissionsRouter.get("/:id/submissions", async (req, res) => {
  const { id: formId } = req.params;
  const key = typeof req.query.key === "string" ? req.query.key : undefined;

  if (!key) return res.status(401).json({ error: "Missing key" });

  const form = await prisma.form.findUnique({
    where: { id: formId },
    select: { manageKey: true },
  });

  if (!form) return res.status(404).json({ error: "Form not found" });
  if (form.manageKey !== key)
    return res.status(403).json({ error: "Invalid key" });

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

  return res.json({ count: submissions.length, submissions });
});
