import { Context, Hono, Next } from "hono/mod.ts";
import { z } from "zod";
import { sign } from "hono/utils/jwt/jwt.ts";
import { User } from "./model.ts";
import { Try } from "fp-try";
import { env } from "../env.ts";

const auth_router = new Hono();

auth_router.post("/sign-up", async (c) => {
	const { username, password } = await c.req.json();
	const user = new User({ username, password });
	const result = await Try(() => user.save());
	if (result.failure) return c.json({ error: result.error.message }, 500);

	const token = await sign({ _id: user._id, username: user.username }, env.JWT_SECRET);
	return c.json({ token });
});

auth_router.post("/login", async (c) => {
	const { username, password } = await c.req.json();
	const user = await User.findOne({ username: { $regex: new RegExp(`^${username}$`, "i") } }).exec();
	if (!user) return c.json({ error: "user with username does not exist" }, 500);

	const passwords_match = await user.comparePassword(password);
	if (!passwords_match) return c.json({ error: "passwords do not match" }, 500);

	const token = await sign({ _id: user._id, username: user.username }, env.JWT_SECRET);
	return c.json({ token });
});

export { auth_router };
