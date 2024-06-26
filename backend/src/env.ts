import { z } from "zod";
import { load } from "dotenv";

await load({ export: true });

export const env = z.object({
	JWT_SECRET: z.string(),
}).parse(Deno.env.toObject());
