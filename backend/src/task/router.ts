import { Context, Hono, Next } from "hono/mod.ts";
import { Task } from "./model.ts";
import { Try } from "../utils/functions/try.ts";
import { z } from "zod";

const body_validator = z.object({
	value: z.string().trim().min(1),
});

type Body = z.infer<typeof body_validator>;

type KV = {
	Variables: {
		body: Body;
	};
};

const task_router = new Hono<KV>();

const bodyValidatorMiddleware = async (c: Context<KV>, next: Next) => {
	const body = await c.req.json();
	const validation_result = body_validator.safeParse(body);

	if (!validation_result.success) return c.json({ message: validation_result.error.message }, 400);
	c.set("body", validation_result.data);

	next();
};

task_router.get("/", async (c) => {
	const result = await Try(() => Task.find().exec());
	if (!result.success) return c.json({ message: result.error.message }, 500);
	return c.json(result.value, 200);
});

task_router.get("/:id", async (c) => {
	const id = c.req.param("id");
	const task = await Try(() => Task.findById(id).exec());

	if (!task.success) return c.json({ message: task.error.message }, 500);
	if (!task.value) return c.json({ message: "Task not found" }, 204);
	return c.json(task.value, 200);
});

task_router.post("/", bodyValidatorMiddleware, async (c) => {
	const body = c.get("body");
	const new_task = await Try(() => Task.create(body));

	if (!new_task.success) return c.json({ message: new_task.error.message }, 500);
	return c.json(new_task.value, 200);
});

task_router.patch("/:id", bodyValidatorMiddleware, async (c) => {
	const id = c.req.param("id");
	const body = c.get("body");
	const patched_task = await Try(() => Task.findByIdAndUpdate(id, body, { new: true }).exec());

	if (!patched_task.success) return c.json({ message: patched_task.error.message }, 500);
	if (!patched_task.value) return c.json({ message: "Task not found" }, 204);
	return c.json(patched_task.value, 200);
});

task_router.delete("/:id", async (c) => {
	const id = c.req.param("id");
	const deleted_task = await Try(() => Task.findByIdAndDelete(id).exec());

	if (!deleted_task.success) return c.json({ message: deleted_task.error.message }, 500);
	if (!deleted_task.value) return c.json({ message: "Task not found" }, 204);
	return c.json({ message: "Task deleted successfully" }, 200);
});

export { task_router };
