class Errors {
  static readonly ACCESS_DENIED = {
    errorCode: 0,
    message: 'access denied',
  };

  static readonly NOT_FOUND = {
    errorCode: 1,
    message: 'not found',
  };

  static readonly AUTH_PARAMS_NOT_VALID = {
    errorCode: 2,
    message: 'auth params not valid',
  };

  static readonly CANT_GET_TOKEN = {
    errorCode: 3,
    message: 'cant get token',
  };
}

export default Errors;
