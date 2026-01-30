import { Elysia } from 'elysia';
import { node } from '@elysiajs/node';
import { cors } from '@elysiajs/cors';
import 'dotenv/config';
import { authRouter } from './routers/auth';
import { userRouter } from './routers/user';
import { missionsRouter } from './routers/missions';
import { rfqRouter } from './routers/rfq';
import { aiRouter } from './routers/ai';
import { positionsRouter } from './routers/positions';
import { chatRouter } from './routers/chat';
import { groupsRouter } from './routers/groups';
import { transactionsRouter } from './routers/transactions';
import { webhookRouter } from './routers/webhook';
import { startEventListener } from './services/listener';

const app = new Elysia({ adapter: node() })
  // Default CORS: Allow all origins (OK for Hackathon/Dev)
  // For Prod: .use(cors({ origin: 'https://kita-app.vercel.app' }))
  .use(cors())
  .get('/health', () => ({ status: 'ok', message: 'KITA API is running' }))
  .group('/api', (app) =>
    app
      .use(authRouter)
      .use(userRouter)
      .use(missionsRouter)
      .use(rfqRouter)
      .use(aiRouter)
      .use(positionsRouter)
      .use(chatRouter)
      .use(groupsRouter)
      .use(transactionsRouter)
  )
  .use(webhookRouter) // Webhooks often need root access or specific paths
  .listen(process.env.PORT || 8000);

startEventListener();
console.log('🚀 KITA API started on port', process.env.PORT || 8000);
