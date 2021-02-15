import { Telemetry, TelemetryClient } from '../src';

const telemetryMock: Telemetry = {
  version: '2.0.0',
  versionHash: 'd233662f9c26d1a06118c93ef2fd1de9',
  requestStatus: 'success',
  methodName: 'getProjects',
  authenticationType: 'basic',
};

describe('TelemetryClient', () => {
  it('should be defined', () => {
    expect(TelemetryClient).toBeDefined();
  });

  it('should accept \'undefined\' config value', () => {
    const telemetryClient = new TelemetryClient();

    // @ts-ignore
    expect(telemetryClient.config).toBeDefined();
    // @ts-ignore
    expect(telemetryClient.config).toBeTruthy();
  });

  it('should accept \'false\' config value', () => {
    const telemetryClient = new TelemetryClient(false);

    // @ts-ignore
    expect(telemetryClient.config).toBeDefined();
    // @ts-ignore
    expect(telemetryClient.config).toBeFalsy();
  });

  it('should accept \'true\' config value', () => {
    const telemetryClient = new TelemetryClient(true);

    // @ts-ignore
    expect(telemetryClient.config).toBeTruthy();
  });

  it('should accept empty config value', () => {
    const telemetryClient = new TelemetryClient({});

    // @ts-ignore
    expect(telemetryClient.config).toEqual({});
  });

  it('should accept full config value', () => {
    const telemetryClient = new TelemetryClient({
      allowedToPassMethodName: true,
      allowedToPassAuthenticationType: true,
      allowedToPassRequestStatus: true,
    });

    // @ts-ignore
    expect(telemetryClient.config).toEqual({
      allowedToPassMethodName: true,
      allowedToPassAuthenticationType: true,
      allowedToPassRequestStatus: true,
    });
  });

  it('should accept partial filled config value', () => {
    const telemetryClient = new TelemetryClient({
      allowedToPassMethodName: true,
      allowedToPassAuthenticationType: false,
    });

    // @ts-ignore
    expect(telemetryClient.config).toEqual({
      allowedToPassMethodName: true,
      allowedToPassAuthenticationType: false,
      allowedToPassRequestStatus: undefined,
    });
  });

  describe('prepareTelemetry method', () => {
    it('should return empty telemetry data case 1', () => {
      const telemetryClient = new TelemetryClient({});

      // @ts-ignore
      const preparedTelemetry = telemetryClient.prepareTelemetry(telemetryMock);

      expect(preparedTelemetry).toEqual({});
    });

    it('should return empty telemetry data case 2', () => {
      const telemetryClient = new TelemetryClient(false);

      // @ts-ignore
      const preparedTelemetry = telemetryClient.prepareTelemetry(telemetryMock);

      expect(preparedTelemetry).toEqual({});
    });

    it('should return empty telemetry data case 3', () => {
      const telemetryClient = new TelemetryClient({
        allowedToPassMethodName: false,
        allowedToPassAuthenticationType: false,
        allowedToPassRequestStatus: false,
      });

      // @ts-ignore
      const preparedTelemetry = telemetryClient.prepareTelemetry(telemetryMock);

      expect(preparedTelemetry).toEqual({});
    });

    it('should return full telemetry data case 1', () => {
      const telemetryClient = new TelemetryClient();

      // @ts-ignore
      const preparedTelemetry = telemetryClient.prepareTelemetry(telemetryMock);

      expect(preparedTelemetry).toEqual(telemetryMock);
    });

    it('should return full telemetry data case 2', () => {
      const telemetryClient = new TelemetryClient(true);

      // @ts-ignore
      const preparedTelemetry = telemetryClient.prepareTelemetry(telemetryMock);

      expect(preparedTelemetry).toEqual(telemetryMock);
    });

    it('should return full telemetry data case 3', () => {
      const telemetryClient = new TelemetryClient({
        allowedToPassRequestStatus: true,
        allowedToPassAuthenticationType: true,
        allowedToPassMethodName: true,
      });

      // @ts-ignore
      const preparedTelemetry = telemetryClient.prepareTelemetry(telemetryMock);

      expect(preparedTelemetry).toEqual(telemetryMock);
    });

    it('should return only request status', () => {
      const telemetryClient = new TelemetryClient({
        allowedToPassAuthenticationType: false,
        allowedToPassMethodName: false,
      });

      // @ts-ignore
      const preparedTelemetry = telemetryClient.prepareTelemetry(telemetryMock);

      expect(preparedTelemetry).toEqual({
        version: telemetryMock.version,
        versionHash: telemetryMock.versionHash,
        requestStatus: telemetryMock.requestStatus,
      });
    });
  });
});
