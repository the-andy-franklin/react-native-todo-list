import mongoose, { Document, Query, Schema } from "mongoose";
// @deno-types="npm:@types/bcryptjs"
import bcrypt from "bcryptjs";
import { Task } from "../task/model.ts";
import { Try } from "fp-try";

export type User = Document & {
	username: string;
	password: string;
	tasks: { type: Schema.Types.ObjectId; ref: "Task" }[];
	comparePassword(candidatePassword: string): Promise<boolean>;
};

const UserSchema = new Schema({
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
}, { timestamps: true });

UserSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();

	this.password = await bcrypt.hash(this.password, 10);
	next();
});

UserSchema.pre("findOneAndDelete", { document: false, query: true }, async function (next) {
	const user = await this.model.findOne(this.getFilter());
	await Try(() => Task.deleteMany({ author: user._id }).exec());
	next();
});

UserSchema.methods.comparePassword = async function (
	candidatePassword: string,
) {
	return await bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<User>("User", UserSchema);
