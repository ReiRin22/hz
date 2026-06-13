import { Controller, Get, Inject, Post, Param, Body, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UserService } from '@/features/user/user.service';

@Controller('user') // 1言：このクラス内の全メソッドのベースパス
export class UserController {
  constructor(@Inject(UserService) private readonly userService: UserService) {}
  
  @Get(':id') // 1言：GET /api/user/:id の定義
  async getUser(@Param('id') id: string) {
    // 検証: IDが "null" だったら500エラー
    // NestJSではExceptionをthrowするのが一般的です（自動でJSONレスポンスになる）
    if (id === "null" || id === "error") {
      console.log("error");
      throw new InternalServerErrorException('Internal Server Error');
    }

    try {
      const userData = await this.userService.getUserFullDetails(id);
      if (!userData) {
        throw new NotFoundException('Not Found');
      }
      
      return userData; // 1言：returnしたオブジェクトは自動的に200 OKでJSON返却される
    } catch (error) {
      // 既にNestのExceptionを投げている場合はそのまま通し、それ以外は500
      if (error instanceof NotFoundException || error instanceof InternalServerErrorException) {
        throw error;
      }
      throw new InternalServerErrorException('Service Error');
    }
  }

  @Post(':id') // POST /api/user/:id
  async updateUser(
    @Param('id') id: string,      // URLパラメータの取得
    @Body() body: { name: string } // リクエストボディの取得
  ) {
    // Expressの console.log 部分
    console.log(`[BFF 業務ロジック] ID: ${id} のユーザー名を「${body.name}」に更新しました`);

    // NestJSでは、オブジェクトをreturnするだけで自動的に res.json() 相当の処理が行われます
    return { 
      success: true, 
      updatedName: body.name 
    };
  }
}