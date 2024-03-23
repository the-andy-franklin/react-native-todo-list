import { Request, Response, Router } from "express";
import { Task } from "./model.ts";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
	try {
		const task = new Task(req.body);
		await task.save();

		res.status(200).json(task);
	} catch (error: unknown) {
		if (error instanceof Error) {
			res.status(500).json({ message: error.message });
		}
	}
});

router.get("/", async (req: Request, res: Response) => {
	try {
		const tasks = await Task.find();

		res.status(200).json(tasks);
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

		res.status(200).json(task);
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

		res.status(200).json(task);
	} catch (error: unknown) {
		if (error instanceof Error) {
			res.status(500).json({ message: error.message });
		}
	}
});

router.delete("/:id", async (req: Request, res: Response) => {
	try {
		const task = await Task.findByIdAndDelete(req.params.id);
		if (!task) return res.status(404).json({ message: "Task not found" });

		res.status(200).json({ message: "Task deleted successfully" });
	} catch (error: unknown) {
		if (error instanceof Error) {
			res.status(500).json({ message: error.message });
		}
	}
});

export default router;
