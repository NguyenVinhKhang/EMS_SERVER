import express from "express";
import cors from "cors"; // Import cors
import * as dotenv from "dotenv";
import connect from "./database/database.js";
import { checkToken } from "./authentication/auth.js";
import { loge, logi } from "./helpers/log.js";
import { routers } from "./routes/routerConstant.js";
import HTTPCode from "./exception/HTTPStatusCode.js";

dotenv.config();

const TAG = "Server";

const app = express();
const port = process.env.PORT ?? 3500;

// Cấu hình middleware CORS
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
      "Access-Control-Request-Method",
      "Access-Control-Request-Headers",
      "Cache-Control",
      "Pragma",
    ],
  })
);

app.use(express.json());
app.use(checkToken);

routers.forEach(({ path, router }) => {
  app.use(path, router);
});

app.get("/ems", (req, res) => {
  res.status(HTTPCode.OK).json({
    message: "Connected Server Successfully",
  });
});

app.listen(port, async () => {
  try {
    await connect();
    logi(TAG, "Connect", `Listen: on port ${port}`);
  } catch (exception) {
    loge(TAG, "SYS_ERR", exception);
  }
});

process.on("uncaughtException", (exception) => {
  loge(TAG, "SYS_ERR", exception);
});
