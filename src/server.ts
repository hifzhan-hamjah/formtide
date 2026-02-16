import "dotenv/config";
import { createApp } from "./app";

const app = createApp();

const port = Number(process.env.PORT ?? 3000);
app.listen(port, () => {
  console.log(
    `✅ API running on ${process.env.BASE_URL ?? `http://localhost:${port}`}`
  );
});
