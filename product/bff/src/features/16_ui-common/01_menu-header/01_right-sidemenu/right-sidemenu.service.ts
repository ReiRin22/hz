import { Injectable } from '@nestjs/common';
import { RightSidemenuClient } from './right-sidemenu.client';

@Injectable()
export class RightSidemenuService {
  constructor(private readonly rightSidemenuClient: RightSidemenuClient) {}

  // TODO: ビジネスロジックを実装
}
