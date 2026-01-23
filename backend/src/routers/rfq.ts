import { Elysia, t } from 'elysia';
import { thetanutsService } from '../services/rfq.service';

/**
 * Thetanuts V4 Orders Router
 *
 * Thetanuts V4 uses a maker-taker model:
 * - Market makers post signed orders off-chain
 * - Takers (KITA) fetch and execute these orders on-chain via fillOrder()
 *
 * There is NO RFQ POST endpoint - orders are fetched, not requested.
 */
export const rfqRouter = new Elysia({ prefix: '/orders' })
  // Get all available PUT sell orders (for cash-secured put strategy)
  .get('/', async () => {
    const orders = await thetanutsService.fetchPutSellOrders();
    return {
      count: orders.length,
      collateral: 'USDC',  // Always USDC on Base
      orders: orders.map((o: any) => thetanutsService.formatOrderForDisplay(o))
    };
  })

  // Explicit alias for cash-secured puts (for frontend clarity)
  .get('/puts', async () => {
    const orders = await thetanutsService.fetchPutSellOrders();
    return {
      count: orders.length,
      collateral: 'USDC',
      orders: orders.map((o: any) => thetanutsService.formatOrderForDisplay(o))
    };
  })

  // Get orders filtered by asset (BTC or ETH)
  .get('/:asset', async ({ params }) => {
    const asset = params.asset.toUpperCase() as 'BTC' | 'ETH';
    if (asset !== 'BTC' && asset !== 'ETH') {
      return { error: 'Asset must be BTC or ETH' };
    }
    const orders = await thetanutsService.fetchOrdersByAsset(asset);
    return {
      asset,
      count: orders.length,
      collateral: 'USDC',
      orders: orders.map((o: any) => thetanutsService.formatOrderForDisplay(o))
    };
  }, {
    params: t.Object({
      asset: t.String()
    })
  })

  // Get user positions (filter by KITA referrer)
  .get('/positions/:address', async ({ params, query }) => {
    const referrer = query.referrer;
    const positions = await thetanutsService.getUserPositions(params.address, referrer);
    return {
      address: params.address,
      count: positions.length,
      positions
    };
  }, {
    params: t.Object({
      address: t.String()
    }),
    query: t.Object({
      referrer: t.Optional(t.String())
    })
  })

  // Get user trade history
  .get('/history/:address', async ({ params }) => {
    const history = await thetanutsService.getUserHistory(params.address);
    return {
      address: params.address,
      count: history.length,
      history
    };
  }, {
    params: t.Object({
      address: t.String()
    })
  })

  // Trigger indexer update (call after fillOrder, wait 15s)
  .post('/sync', async () => {
    const success = await thetanutsService.triggerIndexerUpdate();
    return { success };
  })

  // Get platform stats
  .get('/stats', async () => {
    return await thetanutsService.getStats();
  });
