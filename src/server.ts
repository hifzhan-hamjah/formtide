import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import "dotenv/config";

import { formsRouter } from "./routes/forms";
import { submissionsRouter } from "./routes/submissions";

const app = express();

app.use(cors({ origin: true }));
app.use(express.json({ limit: "1mb" }));

app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api/forms", formsRouter);
app.use("/api/forms", submissionsRouter);

const port = Number(process.env.PORT ?? 3000);
app.listen(port, () => {
  console.log(
    `✅ API running on ${process.env.BASE_URL ?? `http://localhost:${port}`}`
  );
});
