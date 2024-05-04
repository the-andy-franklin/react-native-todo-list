import type { ValueOf } from "./utils/functions/types/ValueOf.ts";

export const EnvVars = {
	ACCESS_TOKEN_SECRET: "ACCESS_TOKEN_SECRET",
	REFRESH_TOKEN_SECRET: "REFRESH_TOKEN_SECRET",
} as const;

export type EnvVars = ValueOf<typeof EnvVars>;
