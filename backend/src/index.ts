import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { rfqRouter } from './routers/rfq';
import { aiRouter } from './routers/ai';
import { positionsRouter } from './routers/positions';
import { groupRouter } from './routers/group';
// Optional blockchain listener; dynamically imported when enabled

const app = new Elysia()
  .use(cors())
  .get('/health', () => ({ status: 'ok', message: 'NUNGGU API (Bun) is running' }))
  .group('/api', (app) => 
    app
      .use(rfqRouter)
      .use(aiRouter)
      .use(positionsRouter)
      .use(groupRouter)
  )
  .listen(process.env.PORT || 8000);
// Start event listener only if explicitly enabled to avoid env/dep issues
if (process.env.ENABLE_LISTENER === '1') {
  import('./services/listener').then(({ startEventListener }) => {
    startEventListener();
  }).catch((err) => {
    console.error('Failed to start listener:', err);
  });
}

console.log(`NUNGGU API started at ${app.server?.hostname}:${app.server?.port}`);