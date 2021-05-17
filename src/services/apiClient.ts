import fetch from 'node-fetch';
import type * as UserAgent from 'nodejs-user-agent';
import { version, endpoint, hash } from '../sensitiveInformation.json';
import { Environment } from '../environements/environment';
import { Telemetry } from '../telemetry';

let userAgent: typeof UserAgent;

if (Environment.platform === 'node') {
  userAgent = require('nodejs-user-agent');
}

interface Request {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'get' | 'post' | 'put' | 'delete';
  body?: any;
}

interface TelemetryMetadata {
  telemetryClientVersion: string;
  telemetryClientVersionHash: string;
  timeDifference: number | null;
}

type TelemetryRequestBody = Array<Partial<Telemetry> & TelemetryMetadata>;

export class ApiClient {
  private timeDifference?: number;

  async createTelemetry(rawTelemeters: Partial<Telemetry> | Partial<Telemetry>[]) {
    const timeDifference = await this.getTimeDifference();
    const telemeters: TelemetryRequestBody = (Array.isArray(rawTelemeters) ? rawTelemeters : [rawTelemeters])
      .map((telemetry) => ({
        ...telemetry,
        telemetryClientVersion: version,
        telemetryClientVersionHash: hash,
        timeDifference: timeDifference || null,
      }));

    const { libVersion } = telemeters[0];

    return this.sendRequest({
      url: '/telemetry',
      method: 'post',
      body: telemeters,
    }, libVersion);
  }

  private async getTime() {
    const { datetime } = await this.sendRequest({
      url: '/time',
      method: 'get',
    });

    return new Date(datetime);
  }

  private async sendRequest<T>(request: Request, libVersion?: string): Promise<T> {
    const url = `${endpoint}${request.url}`;
    const headers: Record<string, string> = {};

    if (Environment.platform === 'node') {
      headers['User-Agent'] = userAgent?.ua('jira.js', libVersion);
    }

    const response = await fetch(url, {
      method: request.method,
      headers,
      compress: true,
      follow: 0,
      body: request.body ? JSON.stringify(request.body) : undefined,
    });

    return response.json();
  }

  private async getTimeDifference() {
    if (this.timeDifference) {
      return this.timeDifference;
    }

    const serverTime = await this.getTime();
    const localTime = new Date();

    this.timeDifference = serverTime
      ? Math.floor((serverTime.getTime() - localTime.getTime()) / 1000)
      : undefined;

    return this.timeDifference;
  }
}
