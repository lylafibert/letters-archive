import type { JsonIndex } from "../../src/site/json-index";

export const parseJsonIndex = (json: string): JsonIndex => JSON.parse(json);
