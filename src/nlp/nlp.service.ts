import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { generateReply } from './utils/reply-generator'; 

@Injectable()
export class NlpService {
  private rasaUrl = 'http://localhost:5005/model/parse';

  async parseMessage(message: string): Promise<{
    intent: string;
    confidence: number;
    entities: any[];
    response: string;
  }> {
    try {
      const response = await axios.post<any>(this.rasaUrl, { text: message });

      const intent = response.data.intent.name;
      const confidence = response.data.intent.confidence;
      const entities = response.data.entities;

      const reply = generateReply(intent);

      return {
        intent,
        confidence,
        entities,
        response: reply,
      };
    } catch (error) {
      console.error('Rasa error:', error.message);
      throw new Error('Failed to contact Rasa server');
    }
  }
}
