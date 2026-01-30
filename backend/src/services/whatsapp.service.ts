export class WhatsAppService {
  async notifyDeposit(params: { groupName: string; memberName: string; amount: number; totalPool: number; count: string; }) {
    // TODO: Integrate WA Business API / Twilio WhatsApp
    console.log(`WA: ✅ ${params.memberName} deposit ${params.amount}. Total pool: ${params.totalPool} (${params.count})`);
    return { sent: false, message: 'stub' };
  }

  async notifyCashback(params: { amount: number; total: number; }) {
    console.log(`WA: 💸 Cashback ${params.amount} masuk! Total: ${params.total}`);
    return { sent: false, message: 'stub' };
  }

  async notifyVoting(params: { question: string; yes: number; no: number; approved: boolean; }) {
    const status = params.approved ? '✅ APPROVED' : '';
    console.log(`WA: 📊 Voting: ${params.question} (Yes: ${params.yes}, No: ${params.no}) ${status}`);
    return { sent: false, message: 'stub' };
  }
}

export const whatsappService = new WhatsAppService();
