export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
} as const;

export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  NOT_ACCEPTABLE: 406,
  INTERNAL_SERVER_ERROR: 500,
} as const;

