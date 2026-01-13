import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { rfqRouter } from './routers/rfq';
import { aiRouter } from './routers/ai';
import { positionsRouter } from './routers/positions';
import { startEventListener } from './services/listener';

const app = new Elysia()
  .use(cors())
  .get('/health', () => ({ status: 'ok', message: 'NUNGGU API (Bun) is running' }))
  .group('/api', (app) => 
    app
      .use(rfqRouter)
      .use(aiRouter)
      .use(positionsRouter)
  )
  .listen(process.env.PORT || 8000);

startEventListener();

console.log(`NUNGGU API started at ${app.server?.hostname}:${app.server?.port}`);