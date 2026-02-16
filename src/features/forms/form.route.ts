import { Router } from "express";
import { FormController } from "./form.controller";

export const formsRouter = Router();

formsRouter.post("/", FormController.create);
formsRouter.get("/:id", FormController.getById);
