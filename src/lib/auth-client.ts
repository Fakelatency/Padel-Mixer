import { createAuthClient } from 'better-auth/react';
import { BASE_PATH } from './basepath';

export const authClient = createAuthClient({
    basePath: `${BASE_PATH}/api/auth`,
});
