import { Elysia, t } from 'elysia';
import { webhookService } from '../services/webhook.service';
import { groupService } from '../services/group.service';

// Auth helper - returns error response if invalid, null if valid
const checkAuth = (request: Request): { status: 401; body: object } | null => {
  const apiKey = request.headers.get('X-API-Key');
  const validKey = process.env.WEBHOOK_API_KEY || 'dev-api-key';
  if (apiKey !== validKey) {
    return {
      status: 401,
      body: {
        success: false,
        error: 'Invalid or missing API key. Provide X-API-Key header.',
        timestamp: new Date().toISOString(),
      },
    };
  }
  return null;
};

/**
 * Webhook Router
 * Endpoints for Telegram/WhatsApp bot integration
 *
 * All endpoints require X-API-Key header authentication
 */
export const webhookRouter = new Elysia({ prefix: '/api/webhook' })

  // ============ User Lookup ============

  .get('/user/by-phone/:phone', async ({ params, request, set }) => {
    const auth = checkAuth(request);
    if (auth) { set.status = auth.status; return auth.body; }

    const user = webhookService.getUserByPhone(params.phone);
    if (!user) {
      return { success: false, error: 'User not found', timestamp: new Date().toISOString() };
    }
    return { success: true, data: user, timestamp: new Date().toISOString() };
  }, { params: t.Object({ phone: t.String() }) })

  .get('/user/by-wallet/:address', async ({ params, request, set }) => {
    const auth = checkAuth(request);
    if (auth) { set.status = auth.status; return auth.body; }

    const user = webhookService.getUserByWallet(params.address);
    return { success: true, data: user, timestamp: new Date().toISOString() };
  }, { params: t.Object({ address: t.String() }) })

  .post('/user/register', async ({ body, request, set }) => {
    const auth = checkAuth(request);
    if (auth) { set.status = auth.status; return auth.body; }

    webhookService.registerUser(body.phone, body.address);
    return { success: true, data: { phone: body.phone, address: body.address }, timestamp: new Date().toISOString() };
  }, { body: t.Object({ phone: t.String(), address: t.String() }) })

  // ============ User Data ============

  .get('/user/:address/summary', async ({ params, request, set }) => {
    const auth = checkAuth(request);
    if (auth) { set.status = auth.status; return auth.body; }

    try {
      const summary = await webhookService.getUserSummary(params.address);
      return { success: true, data: summary, timestamp: new Date().toISOString() };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed', timestamp: new Date().toISOString() };
    }
  }, { params: t.Object({ address: t.String() }) })

  .get('/user/:address/positions', async ({ params, request, set }) => {
    const auth = checkAuth(request);
    if (auth) { set.status = auth.status; return auth.body; }

    try {
      const positions = await webhookService.getUserPositions(params.address);
      return { success: true, data: positions, count: positions.length, timestamp: new Date().toISOString() };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed', timestamp: new Date().toISOString() };
    }
  }, { params: t.Object({ address: t.String() }) })

  .get('/user/:address/groups', async ({ params, request, set }) => {
    const auth = checkAuth(request);
    if (auth) { set.status = auth.status; return auth.body; }

    try {
      const groups = await groupService.getUserGroups(params.address);
      return { success: true, data: groups, count: groups.length, timestamp: new Date().toISOString() };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed', timestamp: new Date().toISOString() };
    }
  }, { params: t.Object({ address: t.String() }) })

  // ============ Quick Actions ============

  .post('/quick-action/check-orders', async ({ body, request, set }) => {
    const auth = checkAuth(request);
    if (auth) { set.status = auth.status; return auth.body; }

    try {
      const orders = await webhookService.findMatchingOrders({
        asset: body.asset,
        minPremiumRate: body.minPremiumRate,
        maxStrikePercent: body.maxStrikePercent,
        collateralAmount: body.collateralAmount,
      });
      return { success: true, data: orders, count: orders.length, timestamp: new Date().toISOString() };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed', timestamp: new Date().toISOString() };
    }
  }, {
    body: t.Object({
      asset: t.Optional(t.Union([t.Literal('BTC'), t.Literal('ETH')])),
      minPremiumRate: t.Optional(t.Number()),
      maxStrikePercent: t.Optional(t.Number()),
      collateralAmount: t.Optional(t.String()),
    }),
  })

  .post('/quick-action/simulate', async ({ body, request, set }) => {
    const auth = checkAuth(request);
    if (auth) { set.status = auth.status; return auth.body; }

    try {
      const result = await webhookService.simulateTrade({
        asset: body.asset,
        collateralAmount: body.collateralAmount,
        orderId: body.orderId,
      });
      if (!result) {
        return { success: false, error: 'No matching orders available', timestamp: new Date().toISOString() };
      }
      return { success: true, data: result, timestamp: new Date().toISOString() };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed', timestamp: new Date().toISOString() };
    }
  }, {
    body: t.Object({
      asset: t.Union([t.Literal('BTC'), t.Literal('ETH')]),
      collateralAmount: t.String(),
      orderId: t.Optional(t.String()),
    }),
  })

  // ============ Notifications ============

  .post('/notification/position-expiring', async ({ body, request, set }) => {
    const auth = checkAuth(request);
    if (auth) { set.status = auth.status; return auth.body; }

    try {
      const positions = await webhookService.getExpiringPositions(body.hoursAhead || 24);
      return { success: true, data: positions, count: positions.length, timestamp: new Date().toISOString() };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed', timestamp: new Date().toISOString() };
    }
  }, { body: t.Object({ hoursAhead: t.Optional(t.Number()) }) })

  .post('/notification/proposal-pending', async ({ body, request, set }) => {
    const auth = checkAuth(request);
    if (auth) { set.status = auth.status; return auth.body; }

    try {
      const proposals = await webhookService.getPendingProposals(body.groupId);
      return { success: true, data: proposals, count: proposals.length, timestamp: new Date().toISOString() };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed', timestamp: new Date().toISOString() };
    }
  }, { body: t.Object({ groupId: t.Optional(t.Number()) }) })

  // ============ Platform Stats ============

  .get('/stats', async ({ request, set }) => {
    const auth = checkAuth(request);
    if (auth) { set.status = auth.status; return auth.body; }

    try {
      const stats = await webhookService.getPlatformStats();
      return { success: true, data: stats, timestamp: new Date().toISOString() };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed', timestamp: new Date().toISOString() };
    }
  });
