import { model, Schema } from "mongoose";

const TaskSchema = new Schema({
	value: { type: String, required: true },
	completed: { type: Boolean, default: false },
}, { timestamps: true });

export const Task = model("Task", TaskSchema);
