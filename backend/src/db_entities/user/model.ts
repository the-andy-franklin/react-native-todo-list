import { Document, model, Schema } from "mongoose";
import bcrypt from "bcrypt";

interface User {
	username: string;
	password: string;
}

interface UserDocument extends User, Document {
	comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<User>({
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true },
});

userSchema.pre<UserDocument>("save", async function (next) {
	if (this.isModified("password") || this.isNew) {
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
	}

	next();
});

userSchema.methods.comparePassword = function (candidatePassword: string): Promise<boolean> {
	return bcrypt.compare(candidatePassword, this.password);
};

const User = model<User>("User", userSchema);
export default User;
