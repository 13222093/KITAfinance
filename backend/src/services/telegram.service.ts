const TELEGRAM_API_URL = "https://api.telegram.org/bot";
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

/**
 * Telegram Bot Service
 * Handles sending notifications and simple polling for commands.
 */
export class TelegramService {
  private offset = 0;
  private isPolling = false;

  constructor() {
    if (!BOT_TOKEN) {
      console.warn("⚠️ TELEGRAM_BOT_TOKEN not set. Telegram service disabled.");
    }
  }

  /**
   * Send a text message to a specific chat ID.
   */
  async sendMessage(chatId: string | number, text: string) {
    if (!BOT_TOKEN) return;

    try {
      const response = await fetch(`${TELEGRAM_API_URL}${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          parse_mode: "Markdown"
        }),
      });

      const data = await response.json();
      if (!data.ok) {
        console.error("❌ Telegram API Error:", data.description);
      } else {
        console.log(`📨 Telegram sent to ${chatId}: ${text.slice(0, 20)}...`);
      }
    } catch (error) {
      console.error("❌ Failed to send Telegram message:", error);
    }
  }

  /**
   * Start polling for updates (simple long polling).
   * Useful for development/hackathon to receive commands without webhook.
   */
  startPolling() {
    if (!BOT_TOKEN || this.isPolling) return;
    
    this.isPolling = true;
    console.log("🤖 Telegram Bot polling started...");
    
    this.pollLoop();
  }

  private async pollLoop() {
    while (this.isPolling) {
      try {
        const response = await fetch(`${TELEGRAM_API_URL}${BOT_TOKEN}/getUpdates?offset=${this.offset + 1}&timeout=30`);
        const data = await response.json();

        if (data.ok && data.result.length > 0) {
          for (const update of data.result) {
            this.offset = update.update_id;
            this.handleUpdate(update);
          }
        }
      } catch (error) {
        console.error("⚠️ Telegram polling error (retrying in 5s):", error);
        await new Promise(r => setTimeout(r, 5000));
      }
    }
  }

  private handleUpdate(update: any) {
    const message = update.message;
    if (!message || !message.text) return;

    const chatId = message.chat.id;
    const text = message.text;
    const user = message.from.username || message.from.first_name;

    console.log(`📩 New Message from ${user} (${chatId}): ${text}`);

    // Simple Command Handler
    if (text === '/start') {
      this.sendMessage(chatId, `👋 Halo *${user}*!

Selamat datang di *NUNGGU Bot*.
ID Chat kamu adalah: ${chatId}

Gunakan ID ini untuk notifikasi Nabung Bareng.`);
    } else if (text === '/ping') {
      this.sendMessage(chatId, "🏓 Pong! Bot aktif.");
    }
  }
}

export const telegramService = new TelegramService();
