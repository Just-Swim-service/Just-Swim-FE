import { HTTP_METHODS, HTTP_STATUS } from '@data';

export type HTTP_METHODS_TYPE = (typeof HTTP_METHODS)[keyof typeof HTTP_METHODS];
export type HTTP_STATUS_TYPE = (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS];
