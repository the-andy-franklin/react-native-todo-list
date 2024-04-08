import { Hono } from "hono";
import { cors } from "hono/middleware.ts";
import { connect } from "mongoose";
import { task_router } from "./task/router.ts";

const app = new Hono();

app.use(cors());

connect("mongodb://localhost:27017/todoApp")
	.then(() => console.log("Connected to MongoDB"))
	.catch((err: unknown) => console.error("Could not connect to MongoDB", err));

app.get("/", (c) => c.text("Hello from myapp backend!"));

app.route("/tasks", task_router);

Deno.serve({ port: 8080 }, app.fetch);
