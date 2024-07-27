import { Context, Hono, Next } from "hono/mod.ts";
import { Task } from "./model.ts";
import { z } from "zod";
import { Try } from "fp-try";
import { User } from "../user/model.ts";

const create_task_body_validator = z.object({
	value: z.string().trim().min(1),
});

type CreateTaskBody = z.infer<typeof create_task_body_validator>;

type CreateTask = {
	Variables: {
		body: CreateTaskBody;
	};
};

const patch_task_body_validator = z.object({
	value: z.string().trim().min(1),
	completed: z.boolean(),
}).partial();

type PatchTaskBody = z.infer<typeof patch_task_body_validator>;

type PatchTask = {
	Variables: {
		body: PatchTaskBody;
	};
};

const task_router = new Hono();

function createMiddleware<E extends ({ Variables: { body: any } })>(validator: z.ZodType) {
	return async (c: Context<E>, next: Next) => {
		const body = await c.req.json();
		const validation_result = validator.safeParse(body);
		if (!validation_result.success) return c.json({ message: validation_result.error.message }, 400);

		c.set("body", validation_result.data);
		await next();
	};
}

const postBodyValidatorMiddleware = createMiddleware<CreateTask>(create_task_body_validator);
const patchBodyValidatorMiddleware = createMiddleware<PatchTask>(patch_task_body_validator);

task_router.get("/", async (c) => {
	const { username }: { username: string } = c.get("jwtPayload");
	const user = await Try(() => User.findOne({ username }).populate("tasks").exec());
	if (user.failure) return c.json({ message: user.error.message }, 500);
	if (!user.data) return c.json({ message: "User not found" }, 400);

	return c.json(user.data.tasks);
});

task_router.get("/:id", async (c) => {
	const id = c.req.param("id");
	const task = await Try(() => Task.findById(id).exec());
	if (task.failure) return c.json({ message: task.error.message }, 500);
	if (!task.data) return c.json({ message: "Task not found" }, 404);

	return c.json(task.data);
});

task_router.post("/", postBodyValidatorMiddleware, async (c) => {
	const { username }: { username: string } = c.get("jwtPayload");
	const user = await User.findOne({ username }).exec();
	if (!user) return c.json({ message: "User not found" }, 400);

	const body = c.get("body");
	const new_task = await Try(() => new Task({ ...body, author: user._id }).save());
	if (new_task.failure) return c.json({ message: new_task.error.message }, 500);
	if (!new_task.data) return c.json({ message: "Task not created" }, 500);

	return c.json(new_task.data);
});

task_router.patch("/:id", patchBodyValidatorMiddleware, async (c) => {
	const id = c.req.param("id");
	const body = c.get("body");
	const patched_task = await Try(() => Task.findByIdAndUpdate(id, body, { new: true }).exec());
	if (patched_task.failure) return c.json({ message: patched_task.error.message }, 500);
	if (!patched_task.data) return c.json({ message: "Task not found" }, 404);

	return c.json(patched_task.data);
});

task_router.delete("/:id", async (c) => {
	const id = c.req.param("id");
	const deleted_task = await Try(() => Task.findByIdAndDelete(id).exec());
	if (deleted_task.failure) return c.json({ message: deleted_task.error.message }, 500);
	if (!deleted_task.data) return c.json({ message: "Task not found" }, 404);

	return c.json({ message: "Task deleted successfully" });
});

export { task_router };
