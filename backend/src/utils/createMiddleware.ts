import { Context, Next } from "hono/mod.ts";
import { z } from "zod";

export function createMiddleware<E extends ({ Variables: { body: any } })>(validator: z.ZodType) {
  return async (c: Context<E>, next: Next) => {
    const body = await c.req.json();
    const validation_result = validator.safeParse(body);
    if (!validation_result.success) return c.json({ message: validation_result.error.message }, 400);

    c.set("body", validation_result.data);
    await next();
  };
}
