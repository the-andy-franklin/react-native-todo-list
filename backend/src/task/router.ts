import { Hono } from "hono";
import { Task } from "./model.ts";

const task_router = new Hono();

task_router.get("/", async (c) => {
	try {
		const tasks = await Task.find();

		return c.json(tasks, 200);
	} catch (error: unknown) {
		if (error instanceof Error) {
			return c.json({ message: error.message }, 500);
		}
	}
});

task_router.get("/:id", async (c) => {
	try {
		const id = c.req.param("id");

		const task = await Task.findById(id);
		if (!task) return c.json({ message: "Task not found" }, 204);

		return c.json(task, 200);
	} catch (error: unknown) {
		if (error instanceof Error) {
			return c.json({ message: error.message }, 500);
		}
	}
});

task_router.post("/", async (c) => {
	try {
		const body = await c.req.json();

		const task = new Task(body);
		await task.save();

		return c.json(task, 200);
	} catch (error: unknown) {
		if (error instanceof Error) {
			return c.json({ message: error.message }, 500);
		}
	}
});

task_router.patch("/:id", async (c) => {
	try {
		const id = c.req.param("id");
		const body = await c.req.json();

		const task = await Task.findByIdAndUpdate(id, body, { new: true });
		if (!task) return c.json({ message: "Task not found" }, 204);

		return c.json(task, 200);
	} catch (error: unknown) {
		if (error instanceof Error) {
			return c.json({ message: error.message }, 500);
		}
	}
});

task_router.delete("/:id", async (c) => {
	try {
		const id = c.req.param("id");

		const task = await Task.findByIdAndDelete(id);
		if (!task) return c.json({ message: "Task not found" }, 204);

		return c.json({ message: "Task deleted successfully" }, 200);
	} catch (error: unknown) {
		if (error instanceof Error) {
			return c.json({ message: error.message }, 500);
		}
	}
});

export { task_router };
