import { Injectable } from '@nestjs/common';
import { FormOutputClient } from './form-output.client';

@Injectable()
export class FormOutputService {
  constructor(private readonly formOutputClient: FormOutputClient) {}

  // TODO: ビジネスロジックを実装
}
