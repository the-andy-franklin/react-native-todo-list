import { Document, model, Query, Schema } from "mongoose";
import { User } from "../user/model.ts";

export type Task = Document & {
	value: string;
	completed: boolean;
	author: User["_id"];
};

const TaskSchema = new Schema<Task>({
	value: { type: String, required: true },
	completed: { type: Boolean, default: false, required: true },
	author: { type: Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

TaskSchema.post<Task>("save", { document: true, query: false }, async function (doc) {
	await User.findOneAndUpdate({ _id: doc.author }, { $push: { tasks: doc._id } }).exec();
});

TaskSchema.post<Query<Task, Task>>("findOneAndDelete", { document: false, query: true }, async function (doc) {
	await User.findOneAndUpdate({ _id: doc.author }, { $pull: { tasks: doc._id } }).exec();
});

export const Task = model<Task>("Task", TaskSchema);
