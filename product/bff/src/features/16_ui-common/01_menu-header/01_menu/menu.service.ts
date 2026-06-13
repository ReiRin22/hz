import { Injectable } from '@nestjs/common';
import { MenuClient } from './menu.client';

@Injectable()
export class MenuService {
  constructor(private readonly menuClient: MenuClient) {}

  // TODO: ビジネスロジックを実装
}
