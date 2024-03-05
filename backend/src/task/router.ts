import { Request, Response, Router } from "express";
import { Task } from "./model.ts";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
	try {
		const task = new Task(req.body, { timestamps: true }, { versionKey: false });
		await task.save();

		res.status(201).json(task);
	} catch (error: unknown) {
		if (error instanceof Error) {
			res.status(400).json({ message: error.message });
		}
	}
});

router.get("/", async (req: Request, res: Response) => {
	try {
		const tasks = await Task.find();

		res.json(tasks);
	} catch (error: unknown) {
		if (error instanceof Error) {
			res.status(500).json({ message: error.message });
		}
	}
});

router.get("/:id", async (req: Request, res: Response) => {
	try {
		const task = await Task.findById(req.params.id);
		if (!task) return res.status(404).json({ message: "Task not found" });

		res.json(task);
	} catch (error: unknown) {
		if (error instanceof Error) {
			res.status(500).json({ message: error.message });
		}
	}
});

router.put("/:id", async (req: Request, res: Response) => {
	try {
		const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
		if (!task) return res.status(404).json({ message: "Task not found" });

		res.json(task);
	} catch (error: unknown) {
		if (error instanceof Error) {
			res.status(400).json({ message: error.message });
		}
	}
});

router.delete("/:id", async (req: Request, res: Response) => {
	try {
		const task = await Task.findByIdAndDelete(req.params.id);
		if (!task) return res.status(404).json({ message: "Task not found" });

		res.json({ message: "Task deleted successfully" });
	} catch (error: unknown) {
		if (error instanceof Error) {
			res.status(500).json({ message: error.message });
		}
	}
});

export default router;
