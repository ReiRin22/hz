import { Injectable } from '@nestjs/common';
import { LeftSidemenuClient } from './left-sidemenu.client';

@Injectable()
export class LeftSidemenuService {
  constructor(private readonly leftSidemenuClient: LeftSidemenuClient) {}

  // TODO: ビジネスロジックを実装
}
