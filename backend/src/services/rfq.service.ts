import axios from 'axios';

export class RFQService {
  private apiUrl = "https://api.thetanuts.finance/v4/rfq";
  private apiKey = process.env.THETANUTS_API_KEY;

  async getQuote(params: {
    underlying: string;
    strike: number;
    collateral: number;
    expiryDays: number;
  }) {
    // Mock for demo if no API Key
    if (!this.apiKey) return this.getMockQuote(params.strike, params.collateral);

    try {
      const response = await axios.post(this.apiUrl, {
        type: "PUT",
        underlying: params.underlying,
        strike: params.strike,
        expiry_days: params.expiryDays,
        collateral_amount: params.collateral,
        collateral_currency: "IDRX",
        chain: "base"
      }, {
        headers: { Authorization: `Bearer ${this.apiKey}` }
      });

      return response.data;
    } catch (error) {
      console.error("RFQ failed, using mock", error);
      return this.getMockQuote(params.strike, params.collateral);
    }
  }

  private getMockQuote(strike: number, collateral: number) {
    const premium = Math.floor(collateral * 0.015); // 1.5% premium
    return {
      quote_id: `0xMOCK${Date.now()}`,
      premium,
      strike,
      expiry: Math.floor(Date.now() / 1000) + 7 * 24 * 3600,
      collateral,
      valid_until: Math.floor(Date.now() / 1000) + 300
    };
  }
}

export const rfqService = new RFQService();