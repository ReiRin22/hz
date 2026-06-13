import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

/**
 * ブラウザ用 MSW Service Worker
 *
 * BFF APIリクエスト(/bff/で始まるパス)のみをモックし、
 * Next.jsのページナビゲーションはモックしない
 */
export const worker = setupWorker(...handlers);
