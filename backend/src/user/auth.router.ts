import { Hono } from "hono/mod.ts";
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
	const result = await Try(() => User.findOne({ username: { $regex: new RegExp(`^${username}$`, "i") } }).exec());
	if (!result.success) return c.json({ error: "Something went wrong" }, 500);
	if (!result.data) return c.json({ error: "Unauthorized" }, 400);
	const user = result.data;

	const passwords_match = await Try(() => user.comparePassword(password));
	if (passwords_match.failure) return c.json({ error: "Something went wrong" }, 500);
	if (!passwords_match.data) return c.json({ error: "Unauthorized" }, 401);

	const token = await sign({ _id: user._id, username: user.username }, env.JWT_SECRET);
	return c.json({ token });
});

export { auth_router };
