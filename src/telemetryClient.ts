import { TelemetryConfig } from './telemetryConfig';
import { Telemetry } from './telemetry';

export class TelemetryClient {
  private readonly config: boolean | TelemetryConfig;

  constructor(config?: boolean | TelemetryConfig) {
    this.config = config ?? true;
  }

  async sendTelemetry(telemetry: Telemetry) {
    try {
      const preparedTelemetry = this.prepareTelemetry(telemetry);
      // @ts-ignore
      console.log(preparedTelemetry);
    } catch {
      // ignore
    }
  }

  private prepareTelemetry(rawTelemetry: Telemetry): Partial<Telemetry> {
    if (typeof this.config === 'boolean') {
      return this.config ? rawTelemetry : {};
    }

    if (Object.keys(this.config).length === 0) {
      return {};
    }

    const mappedConfig: Record<keyof Telemetry, boolean> = {
      version: true,
      versionHash: true,
      requestStatus: this.config.allowedToPassRequestStatus ?? true,
      authenticationType: this.config.allowedToPassAuthenticationType ?? true,
      methodName: this.config.allowedToPassMethodName ?? true,
    };

    const preparedTelemetry: Partial<Telemetry> = {};

    const entries = Object.entries(mappedConfig) as unknown as [keyof Telemetry, boolean][];

    entries.forEach(([key, allowed]) => {
      if (allowed) {
        preparedTelemetry[key] = rawTelemetry[key];
      }
    });

    return Object.keys(preparedTelemetry).length === 2 ? {} : preparedTelemetry;
  }
}
