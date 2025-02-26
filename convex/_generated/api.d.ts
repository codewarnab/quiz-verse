/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as actions from "../actions.js";
import type * as helpers from "../helpers.js";
import type * as http from "../http.js";
import type * as quizes from "../quizes.js";
import type * as rooms from "../rooms.js";
import type * as systemMessagtes from "../systemMessagtes.js";
import type * as user from "../user.js";
import type * as zodSchema from "../zodSchema.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  actions: typeof actions;
  helpers: typeof helpers;
  http: typeof http;
  quizes: typeof quizes;
  rooms: typeof rooms;
  systemMessagtes: typeof systemMessagtes;
  user: typeof user;
  zodSchema: typeof zodSchema;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
