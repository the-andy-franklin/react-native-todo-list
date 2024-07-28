import { Hono } from "hono/mod.ts";
import { User } from "./model.ts";

export const user_router = new Hono();

user_router.get("/me", async (c) => {
	const { username } = c.get("jwtPayload");
	const user = await User.findOne({ username }).populate("tasks").exec();

	return c.json(user);
});

user_router.delete("/me", async (c) => {
	const { username } = c.get("jwtPayload");

	const user = await User.findOneAndDelete({ username }).exec();
	if (!user) return c.json({ error: "user does not exist" }, 500);

	return c.json({ message: "User deleted" });
});
