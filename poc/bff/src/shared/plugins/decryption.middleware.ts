import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class DecryptionMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.body && req.body._obfuscated && req.body.payload) {
      console.log('[BFF 共通基盤] 難読化データを検知しました:', req.body.payload);

      try {
        // Base64から復号
        const binString = atob(req.body.payload);
        const uint8array = Uint8Array.from(binString, (m) => m.codePointAt(0)!);
        const decodedStr = new TextDecoder().decode(uint8array);

        // req.body を元の生データに差し替える
        req.body = JSON.parse(decodedStr);

        console.log('[BFF 共通基盤] 復号完了:', req.body);
      } catch (e) {
        if (e instanceof Error) {
            console.error('[BFF 共通基盤] 復号に失敗しました:', e.message);
        } else {
            // Error型ですらない何かが投げられた場合のフォールバック
            console.error('[BFF 共通基盤] 予期せぬエラーが発生しました:', e);
        }
      }
    }
    next();
  }
}