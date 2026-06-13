import { Injectable, Inject } from "@nestjs/common";
import { CurrentUserClient, type UpstreamCurrentUser, type UpstreamUserAlert } from "./current-user.client";
import type {
  GetCurrentUserResponse,
  CurrentUserResponse,
  UserAlertResponse,
} from "./types/current-user.api.response";

const ALERT_TYPE_MAP: Record<string, UserAlertResponse["type"]> = {
  system: "system",
  task: "task",
  notification: "notification",
  warning: "warning",
};

const ALERT_PRIORITY_MAP: Record<string, UserAlertResponse["priority"]> = {
  low: "low",
  medium: "medium",
  high: "high",
  critical: "critical",
};

@Injectable()
export class CurrentUserService {
  constructor(@Inject(CurrentUserClient) private readonly currentUserClient: CurrentUserClient) {}

  async getCurrentUser(): Promise<GetCurrentUserResponse> {
    const { currentUser, userAlerts, proxyApprovalCount, hpkiRemainingTime } =
      await this.currentUserClient.fetchCurrentUserData();

    return {
      currentUser: this.transformCurrentUser(currentUser),
      userAlerts: userAlerts.map((a) => this.transformUserAlert(a)),
      proxyApprovalCount,
      hpkiRemainingTime,
    };
  }

  private transformCurrentUser(upstream: UpstreamCurrentUser): CurrentUserResponse {
    return {
      id: upstream.userId,
      name: upstream.fullName,
      role: upstream.occupation,
      department: upstream.belongingDept,
      loginTime: upstream.sessionStartedAt,
    };
  }

  private transformUserAlert(upstream: UpstreamUserAlert): UserAlertResponse {
    return {
      id: upstream.alertId,
      type: ALERT_TYPE_MAP[upstream.alertType] ?? "notification",
      title: upstream.title,
      message: upstream.body,
      priority: ALERT_PRIORITY_MAP[upstream.severity] ?? "low",
      timestamp: upstream.issuedAt,
      dismissed: upstream.acknowledged,
      userId: upstream.targetUserId,
    };
  }
}
