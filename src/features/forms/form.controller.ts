import { Request, Response } from "express";
import { createFormSchema } from "./form.schema";
import { FormService } from "./form.service";
import { z } from "zod";

export const FormController = {
  async create(req: Request, res: Response) {
    const parsed = createFormSchema.safeParse(req.body);

    if (!parsed.success) {
      const details = z.flattenError(parsed.error);
      return res.status(400).json({
        error: "Invalid input",
        details,
      });
    }

    const form = await FormService.createForm(parsed.data);

    const baseUrl =
      process.env.BASE_URL ?? `http://localhost:${process.env.PORT ?? 3000}`;

    return res.json({
      ...form,
      submitUrl: `${baseUrl}/api/forms/${form.id}/submissions`,
      submissionsUrl: `${baseUrl}/api/forms/${form.id}/submissions?key=${form.manageKey}`,
    });
  },

  async getById(req: Request, res: Response) {
    const { id } = req.params;

    const form = await FormService.getFormById(id);

    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

    return res.json(form);
  },
};
