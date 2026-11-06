import { AsyncLocalStorage } from "node:async_hooks";
import { register } from "node:module";

globalThis.AsyncLocalStorage = AsyncLocalStorage;
register("./ts-resolver.mjs", import.meta.url);
