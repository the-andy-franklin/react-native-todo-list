import { Document, model, Schema } from "mongoose";

type Task = Document & {
	value: string;
	completed: boolean;
	author: { type: Schema.Types.ObjectId; ref: "User" };
};

const TaskSchema = new Schema({
	value: { type: String, required: true },
	completed: { type: Boolean, default: false, required: true },
	author: { type: Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

TaskSchema.pre("findOneAndDelete", { document: false, query: true }, async function (next) {
	const task = await this.model.findOne(this.getFilter()).populate("author").exec();
	await task.author.tasks.pull(task._id);
	await task.author.save();
	next();
});

export const Task = model<Task>("Task", TaskSchema);
