import { Controller, Post, Body } from '@nestjs/common';
import { NlpService } from './nlp.service';

@Controller('nlp')
export class NlpController {
  constructor(private readonly nlpService: NlpService) {}

  @Post()
  async analyze(@Body('message') message: string) {
    const result = await this.nlpService.parseMessage(message);
    
    return {
      intent: result.intent,
      confidence: result.confidence,
      entities: result.entities,
      response: result.response,
    };
  }
}
