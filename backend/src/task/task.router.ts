import { Hono } from "hono/mod.ts";
import { Task } from "./model.ts";
import { Try } from "fp-try";
import { User } from "../user/model.ts";
import { taskPatchBodyValidatorMiddleware, taskPostBodyValidatorMiddleware } from "./middleware.ts";

export const task_router = new Hono();

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

task_router.post("/", taskPostBodyValidatorMiddleware, async (c) => {
	const { username }: { username: string } = c.get("jwtPayload");
	const user = await User.findOne({ username }).exec();
	if (!user) return c.json({ message: "User not found" }, 400);

	const body = c.get("body");
	const new_task = await Try(() => new Task({ ...body, author: user._id }).save());
	if (new_task.failure) return c.json({ message: new_task.error.message }, 500);

	return c.json(new_task.data);
});

task_router.patch("/:id", taskPatchBodyValidatorMiddleware, async (c) => {
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
