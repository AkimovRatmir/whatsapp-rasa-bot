import { Module } from '@nestjs/common';
import { WhatsappService } from './whatsapploc.service';
import { NlpModule } from 'src/nlp/nlp.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [NlpModule, UserModule],
  providers: [WhatsappService],
  exports: [WhatsappService],
})
export class WhatsAppModule {}
