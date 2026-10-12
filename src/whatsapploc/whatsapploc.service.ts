import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, LocalAuth } from 'whatsapp-web.js';
import * as qrcode from 'qrcode-terminal';
import { NlpService } from '../nlp/nlp.service';
import { UserService } from '../user/user.service';

@Injectable()
export class WhatsappService implements OnModuleInit {
  private client: Client;

  // Numbers the bot ignores, from BLOCKED_NUMBERS=77001234567,77007654321
  private blockedNumbers = (process.env.BLOCKED_NUMBERS ?? '')
    .split(',')
    .map((n) => n.trim())
    .filter(Boolean)
    .map((n) => (n.endsWith('@c.us') ? n : `${n}@c.us`));

  constructor(
    private readonly nlpService: NlpService,
    private readonly userService: UserService,
  ) {}

  async onModuleInit() {
    this.client = new Client({
      authStrategy: new LocalAuth(),
    });

    this.client.on('qr', (qr) => {
      qrcode.generate(qr, { small: true });
    });

    this.client.on('ready', () => {
      console.log('✅ WhatsApp is ready!');
    });

    this.client.on('message', async (msg) => {
      const text = msg.body;
      const phoneNumber = msg.from;

      if (this.blockedNumbers.includes(phoneNumber)) {
        console.log(`🚫 Message from blocked number: ${phoneNumber}`);
        return;
      }

      try {
        const rasaResponse = await this.nlpService.parseMessage(text);

        // Extract section number from intent like "section_1_problem"
        const match = rasaResponse.intent.match(/^section_(\d+)_problem$/);
        if (match) {
          const section = match[1]; // Extracts '1', '2', etc.
          await this.userService.saveUserState(phoneNumber, section);
          console.log(`📦 Saved section ${section} for user ${phoneNumber}`);
        }

        await msg.reply(rasaResponse.response);
      } catch (err) {
        console.error('❌ Error processing message:', err.message);
        await msg.reply('Произошла ошибка при обработке вашего запроса.');
      }
    });

    this.client.initialize();
  }
}
