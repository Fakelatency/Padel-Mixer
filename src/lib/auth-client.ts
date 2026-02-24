import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
    basePath: '/padel/api/auth',
});
