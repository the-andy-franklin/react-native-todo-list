import { Hono } from "hono/mod.ts";
import { cors, jwt } from "hono/middleware.ts";
import { connect } from "mongoose";
import { task_router } from "./task/router.ts";
import { auth_router } from "./user/auth.router.ts";
import { user_router } from "./user/router.ts";
import { env } from "./env.ts";

const app = new Hono();
app.use(cors());

await connect("mongodb://localhost:27017/todoApp")
	.then(() => console.log("Connected to MongoDB"))
	.catch((err) => console.error("Could not connect to MongoDB", err));

app.route("/", auth_router);
app.use(jwt({ secret: env.JWT_SECRET }));
app.route("/user", user_router);

app.get("/", (c) => c.text("Hello from backend!"));
app.route("/tasks", task_router);
app.all("*", (c) => c.body(null, 404));

Deno.serve({ port: 8080 }, app.fetch);
