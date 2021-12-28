import { TelemetryConfig } from './telemetryConfig';
import { Telemetry } from './telemetry';

export class TelemetryClient {
  constructor(config?: boolean | TelemetryConfig) {}

  async sendTelemetry(rawTelemetry: Telemetry) {}
}
