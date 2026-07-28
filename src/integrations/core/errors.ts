export class IntegrationError extends Error {
  constructor(
    message: string,
    public readonly integrationId: string,
    public readonly code: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = "IntegrationError";
  }
}

export class IntegrationConfigurationError extends IntegrationError {
  constructor(integrationId: string, message: string) {
    super(message, integrationId, "CONFIGURATION_ERROR");
    this.name = "IntegrationConfigurationError";
  }
}

export class IntegrationRequestError extends IntegrationError {
  constructor(
    integrationId: string,
    message: string,
    public readonly status?: number,
    cause?: unknown,
  ) {
    super(message, integrationId, "REQUEST_ERROR", cause);
    this.name = "IntegrationRequestError";
  }
}
