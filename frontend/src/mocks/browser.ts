import { setupWorker } from 'msw/browser';
import { authHandlers } from './handlers/auth.handlers';
import { documentTypesHandlers } from './handlers/document-types.handlers';
import { chatHandlers } from './handlers/chat.handlers';
import { generationHandlers } from './handlers/generation.handlers';
import { adminHandlers } from './handlers/admin.handlers';

export const worker = setupWorker(
    ...authHandlers,
    ...documentTypesHandlers,
    ...chatHandlers,
    ...generationHandlers,
    ...adminHandlers
);
