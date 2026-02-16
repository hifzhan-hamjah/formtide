import { Request, Response } from "express";
import { SubmissionsService } from "./submission.service";

export const SubmissionsController = {
  async create(req: Request, res: Response) {
    try {
      const submission = await SubmissionsService.createSubmission(
        req.params.id,
        req.body ?? {},
        req.ip ?? "",
        req.headers["user-agent"] ?? null,
      );

      if (!submission) return res.json({ success: true });

      return res.json({
        success: true,
        submissionId: submission.id,
        createdAt: submission.createdAt,
      });
    } catch (error: any) {
      return res.status(error.status ?? 500).json({ error: error.message });
    }
  },

  async getAll(req: Request, res: Response) {
    try {
      const key = typeof req.query.key === "string" ? req.query.key : undefined;

      const submissions = await SubmissionsService.getSubmission(
        req.params.id,
        key,
      );

      return res.json({ count: submissions.length, submissions });
    } catch (error: any) {
      return res.status(error.status ?? 500).json({ error: error.message });
    }
  },
};
