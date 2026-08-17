import { app } from "../server/index";

export default function handler(req: any, res: any) {
  try {
    return app(req, res);
  } catch (error: any) {
    console.error("[FATAL API HANDLER ERROR]", error);
    return res.status(500).json({
      error: "Internal Server Error in API handler",
      message: error?.message || String(error),
    });
  }
}
