import { TelemetryConfig } from './telemetryConfig';
import { Telemetry } from './telemetry';
import { ApiClient } from './services';

export class TelemetryClient {
  private readonly apiClient = new ApiClient();
  private readonly config: boolean | TelemetryConfig;
  private queue: Partial<Telemetry>[] = [];
  private debounce?: NodeJS.Timeout;

  constructor(config?: boolean | TelemetryConfig) {
    this.config = config ?? true;
  }

  async sendTelemetry(rawTelemetry: Telemetry) {
    try {
      const telemetry = this.prepareTelemetry(rawTelemetry);

      if (Object.keys(telemetry).length === 0) {
        return;
      }

      this.debounce && clearTimeout(this.debounce);
      this.setDebounce();

      this.queue.push(telemetry);
    } catch {
      // ignore
    }
  }

  private async sendBulk() {
    try {
      if (this.queue.length) {
        await this.apiClient.createTelemetry(this.queue);

        this.queue.length = 0;
      }
    } catch (e) {
      // ignore
    }
  }

  private prepareTelemetry(rawTelemetry: Telemetry) {
    if (typeof this.config === 'boolean') {
      return this.config ? rawTelemetry : {};
    }

    if (Object.keys(this.config).length === 0) {
      return {};
    }

    const mappedConfig: Record<keyof Telemetry, boolean> = {
      libVersion: true,
      libVersionHash: true,
      methodName: true,
      authentication: this.config.allowedToPassAuthenticationType ?? true,
      strict_GDPR_enabled: true,
      baseRequestConfigUsed: true,
      onResponseMiddlewareUsed: true,
      onErrorMiddlewareUsed: true,
      callbackUsed: true,
      queryExists: true,
      bodyExists: true,
      headersExists: true,
      requestStatusCode: this.config.allowedToPassRequestStatusCode ?? true,
      requestStartTime: this.config.allowedToPassRequestTimings ?? true,
      requestEndTime: this.config.allowedToPassRequestTimings ?? true,
      noCheckAtlassianToken: true,
    };

    const preparedTelemetry: Partial<Telemetry> = {};

    const entries = Object.entries(mappedConfig) as unknown as [keyof Telemetry, boolean][];

    entries.forEach(([key, allowed]) => {
      if (allowed) {
        // @ts-ignore
        preparedTelemetry[key] = rawTelemetry[key];
      }
    });

    return preparedTelemetry;
  }

  private setDebounce() {
    this.debounce = setTimeout(() => this.sendBulk(), 10);
  }
}
