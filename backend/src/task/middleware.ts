import { z } from "zod";
import { createMiddleware } from "../utils/createMiddleware.ts";

const create_task_body_validator = z.object({
  value: z.string().trim().min(1),
});

type CreateTask = {
  Variables: {
    body: z.infer<typeof create_task_body_validator>;
  };
};

export const taskPostBodyValidatorMiddleware = createMiddleware<CreateTask>(create_task_body_validator);

const patch_task_body_validator = z.object({
  value: z.string().trim().min(1),
  completed: z.boolean(),
}).partial();

type PatchTask = {
  Variables: {
    body: z.infer<typeof patch_task_body_validator>;
  };
};

export const taskPatchBodyValidatorMiddleware = createMiddleware<PatchTask>(patch_task_body_validator);
