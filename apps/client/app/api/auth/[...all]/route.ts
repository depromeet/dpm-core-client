import { auth } from '@dpm-core/shared/src/auth/server';
import { toNextJsHandler } from 'better-auth/next-js';

export const { POST, GET } = toNextJsHandler(auth);
