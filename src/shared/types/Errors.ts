/**
 * The reasons for which a ServiceError may be thrown.
 */
 export enum ServiceErrorReason {
    INTERNAL = "InternalServiceError",
  }
  
  /**
   * Defines an error that the service encountered when processing a request.
   */
  export class ServiceError extends Error {
    constructor(message: string, type: ServiceErrorReason) {
      super(message);
      this.name = type;
    }
  }
  
  /**
   * Defines an error involving a specific resource in the service.
   */
  export class ResourceError extends Error {
      constructor(message: string, type: ResourceErrorReason) {
        super(message);
        this.name = type;
      }
    }
    
/**
 * The reasons for which a ResourceError may be thrown.
 */
export enum ResourceErrorReason {
  FORBIDDEN = "Forbidden",
  INVALID_ACCESS = "InvalidAccess",
  NOT_FOUND = "NotFound",
  BAD_REQUEST = "BadRequest",
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
  TOO_MANY_REQUEST = "TooManyRequest"
}