import axios from 'axios';
import { getCurrentConfig } from '../config';

/**
 * Thetanuts V4 Order Service
 *
 * IMPORTANT: Thetanuts V4 does NOT use RFQ POST requests.
 * Market makers post signed orders, and takers fetch and fill them.
 *
 * Official API Endpoints (from docs.thetanuts.finance):
 * - Orders: https://round-snowflake-9c31.devops-118.workers.dev/
 * - Indexer: https://optionbook-indexer.thetanuts.finance/api/v1/
 *
 * Supported Collateral: USDC, WETH, CBBTC (IDRX NOT SUPPORTED)
 */
export class ThetanutsService {
  // Official API endpoints
  private ordersApiUrl = "https://round-snowflake-9c31.devops-118.workers.dev/";
  
  // Cache storage
  private cachedOrders: any[] | null = null;
  private lastFetchTime: number = 0;
  private readonly CACHE_DURATION_MS = 30 * 1000; // 30 seconds

  /**
   * Fetch all available orders from Thetanuts V4
   * Poll every ~30 seconds and fetch fresh before trade execution
   */
  async fetchOrders() {
    const now = Date.now();

    // Return cached data if valid
    if (this.cachedOrders && (now - this.lastFetchTime < this.CACHE_DURATION_MS)) {
      return this.cachedOrders;
    }

    try {
      const response = await axios.get(this.ordersApiUrl);
      this.cachedOrders = response.data.data.orders;
      this.lastFetchTime = now;
      return this.cachedOrders;
    } catch (error) {
      console.error("Failed to fetch Thetanuts orders", error);
      // Return old cache if available even if expired, otherwise empty
      return this.cachedOrders || [];
    }
  }

  /**
   * Force refresh orders (bypass cache)
   * Useful right before executing a trade
   */
  async refreshOrders() {
    this.cachedOrders = null;
    return this.fetchOrders();
  }

  /**
   * Filter for PUT sell orders (cash-secured put strategy)
   * This is what KITA needs for "Beli Murah Dapat Cashback"
   */
  async fetchPutSellOrders() {
    const config = getCurrentConfig();
    const orders = await this.fetchOrders();
    // Safety check if orders is undefined
    if (!orders) return [];
    
    return orders.filter((o: any) =>
      !o.order.isCall &&  // Put option
      !o.order.isLong &&  // Selling (user receives premium)
      o.order.collateral.toLowerCase() === config.contracts.usdc.toLowerCase()
    );
  }

  /**
   * Filter orders by asset (BTC or ETH based on priceFeed)
   */
  async fetchOrdersByAsset(asset: 'BTC' | 'ETH') {
    const config = getCurrentConfig();
    const orders = await this.fetchPutSellOrders();
    const targetFeed = asset === 'BTC' ? config.contracts.priceFeeds.btc : config.contracts.priceFeeds.eth;

    return orders.filter((o: any) =>
      o.order.priceFeed.toLowerCase() === targetFeed.toLowerCase()
    );
  }

  /**
   * Get user positions from indexer
   * Filter by referrer to show only positions created through KITA
   */
  async getUserPositions(userAddress: string, referrer?: string) {
    try {
      const config = getCurrentConfig();
      const response = await axios.get(`${config.indexerUrl}/user/${userAddress}/positions`);
      if (referrer) {
        return response.data.filter((p: any) => p.referrer?.toLowerCase() === referrer.toLowerCase());
      }
      return response.data;
    } catch (error) {
      console.error("Failed to fetch user positions", error);
      return [];
    }
  }

  /**
   * Get user trade history
   */
  async getUserHistory(userAddress: string) {
    try {
      const config = getCurrentConfig();
      const response = await axios.get(`${config.indexerUrl}/user/${userAddress}/history`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch user history", error);
      return [];
    }
  }

  /**
   * Trigger indexer update after fillOrder
   * Wait ~15 seconds after trade before calling
   */
  async triggerIndexerUpdate() {
    try {
      const config = getCurrentConfig();
      await axios.get(`${config.indexerUrl}/update`);
      return true;
    } catch (error) {
      console.error("Failed to trigger indexer update", error);
      return false;
    }
  }

  /**
   * Get platform stats
   */
  async getStats() {
    try {
      const config = getCurrentConfig();
      const response = await axios.get(`${config.indexerUrl}/stats`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch stats", error);
      return null;
    }
  }

  /**
   * Format order for display (convert decimals)
   */
  formatOrderForDisplay(order: any) {
    const config = getCurrentConfig();
    const isBTC = order.order.priceFeed.toLowerCase() === config.contracts.priceFeeds.btc.toLowerCase();

    return {
      asset: isBTC ? 'BTC' : 'ETH',
      strikes: order.order.strikes.map((s: string) => Number(s) / 1e8),
      pricePerContract: Number(order.order.price) / 1e8,  // 8 decimals
      maxCollateral: Number(order.order.maxCollateralUsable) / 1e6,  // 6 decimals (USDC)
      expiry: new Date(Number(order.order.expiry) * 1000).toISOString(),
      isCall: order.order.isCall,
      isLong: order.order.isLong,
      collateral: 'USDC',  // Always USDC on Base
      signature: order.signature,
      optionBookAddress: order.optionBookAddress
    };
  }
}

export const thetanutsService = new ThetanutsService();

// Backwards compatibility alias
export const rfqService = thetanutsService;