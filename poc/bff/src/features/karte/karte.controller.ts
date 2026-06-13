import { Controller, Get, Inject, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { KarteService } from '@/features/karte/karte.service';

@Controller('karte') // 1言：このクラス内の全メソッドのベースパス
export class KarteController {
  constructor(@Inject(KarteService) private readonly karteService: KarteService) {}
  
  @Get() // 1言：GET /api/user/:id の定義
  async getPatient() {
    console.log('GET /api/karte - 1万件のデータを送信します');
    try {
      const patientData = await this.karteService.getPatients();
      if (!patientData) {
        throw new NotFoundException('Not Found');
      }
      
      return patientData; // 1言：returnしたオブジェクトは自動的に200 OKでJSON返却される
    } catch (error) {
      // 既にNestのExceptionを投げている場合はそのまま通し、それ以外は500
      if (error instanceof NotFoundException || error instanceof InternalServerErrorException) {
        throw error;
      }
      throw new InternalServerErrorException('Service Error');
    }
  }
}