import { Context, Hono, Next } from "hono/mod.ts";
import { z } from "zod";
import { sign } from "hono/utils/jwt/jwt.ts";
import { User } from "./model.ts";
import { Try } from "fp-try";
import { env } from "../env.ts";

const auth_router = new Hono();

auth_router.post("/signup", async (c) => {
	const { username, password } = await c.req.json();
	const user = new User({ username, password });
	const result = await Try(() => user.save());
	if (result.failure) return c.json({ error: result.error.message }, 500);

	const token = await sign({ _id: user._id, username: user.username }, env.JWT_SECRET);
	return c.json({ token });
});

auth_router.post("/signin", async (c) => {
	const { username, password } = await c.req.json();
	const find_result = await Try(() =>
		User.findOne({ username: { $regex: new RegExp(`^${username}$`, "i") } }).exec()
	);
	if (!find_result.success) return c.json({ error: "Something went wrong" }, 500);
	if (!find_result.data) return c.json({ error: "User not found" }, 400);
	const user = find_result.data;

	const passwords_match = await user.comparePassword(password);
	if (!passwords_match) return c.json({ error: "passwords do not match" }, 500);

	const token = await sign({ _id: user._id, username: user.username }, env.JWT_SECRET);
	return c.json({ token });
});

export { auth_router };
