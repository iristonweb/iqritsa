import "dotenv/config";
import express, { type Request, type Response, type NextFunction } from "express";
import serverless from "serverless-http";
import { registerRoutes } from "../server/routes";

let handlerPromise: Promise<ReturnType<typeof serverless>> | null = null;

async function createHandler() {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  const corsOrigins = (process.env.CORS_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (corsOrigins.length > 0) {
    app.use((req, res, next) => {
      const origin = req.header("origin");
      if (origin && corsOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Origin", origin);
        res.header("Vary", "Origin");
        res.header("Access-Control-Allow-Headers", "Authorization, Content-Type, X-Dev-User-Id");
        res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
      }

      if (req.method === "OPTIONS") {
        return res.sendStatus(204);
      }
      next();
    });
  }

  await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
  });

  return serverless(app);
}

export default async function handler(req: any, res: any) {
  if (!handlerPromise) {
    handlerPromise = createHandler();
  }
  const h = await handlerPromise;
  return h(req, res);
}
