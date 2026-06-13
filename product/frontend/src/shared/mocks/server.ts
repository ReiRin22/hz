import { setupServer } from "msw/node";
import { handlers } from "./handlers";

/** テスト用 MSW サーバー（Node.js 環境） */
export const server = setupServer(...handlers);
