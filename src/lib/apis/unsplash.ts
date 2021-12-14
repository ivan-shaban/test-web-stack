import { createApi } from 'unsplash-js';
import nodeFetch from 'node-fetch';

export const unsplashAPI = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY!,
  // @ts-ignore
  fetch: nodeFetch,
});
