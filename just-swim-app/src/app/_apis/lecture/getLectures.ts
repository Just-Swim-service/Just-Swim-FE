'use server';

import api from '../api';
import { HTTP_METHODS } from '@data';

export async function getLectures(): Promise<any> {
  return await api('/lecture/myLectures', HTTP_METHODS.GET);
}
