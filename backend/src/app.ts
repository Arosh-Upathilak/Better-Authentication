import express, { Request,Response,NextFunction } from "express";
import { config } from "./config/env";
import cors from "cors";
import { NotFoundError } from "./errors";
import morgan from "morgan";
import { slTimeConfig } from "./config/sl.time.config";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";


const app = express();

app.set("trust proxy",1);

const corsOptions = {
  origin: [config.CLIENT_URL],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

morgan.token("sl-date", slTimeConfig);
app.use(
  morgan(
    "[:sl-date] :method :url :remote-addr :status :res[content-length] -> :response-time ms",
  ),
);

// Define auth router
app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

// Define routers
app.get("/",(req,res)=>{
    res.send("Hello World")
})


app.all(/.*/,(req:Request,res:Response,next:NextFunction)=>{
    next(new NotFoundError(`Cannot find ${req.method} ${req.originalUrl}`))
})

export default app;