export type ValueOf<T extends Record<PropertyKey, unknown>> = T[keyof T];
