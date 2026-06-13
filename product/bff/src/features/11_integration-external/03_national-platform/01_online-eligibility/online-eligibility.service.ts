import { Injectable } from '@nestjs/common';
import { OnlineEligibilityClient } from './online-eligibility.client';

@Injectable()
export class OnlineEligibilityService {
  constructor(private readonly onlineEligibilityClient: OnlineEligibilityClient) {}

  // TODO: ビジネスロジックを実装
}
