import { Router } from "express";
import { SubmissionsController } from "./submission.controller";

export const submissionsRouter = Router();

submissionsRouter.post("/:id/submissions", SubmissionsController.create);
submissionsRouter.get("/:id/submissions", SubmissionsController.getAll);
