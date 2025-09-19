import { Injectable, OnModuleInit } from '@nestjs/common';
import { ReservasService } from './reservas.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ConsumerService implements OnModuleInit {
  constructor(private readonly reservasService: ReservasService) {}

  async onModuleInit() {
    const messagesDir = path.join(process.cwd(), 'src', 'messages');
    if (!fs.existsSync(messagesDir)) return;
    const files = fs.readdirSync(messagesDir).filter((f) => f.endsWith('.json'));
    for (const file of files) {
      try {
        const txt = fs.readFileSync(path.join(messagesDir, file), 'utf8');
        const payload = JSON.parse(txt);
        console.log('Processing message', file);
        await this.reservasService.processPayload(payload);
        const processedDir = path.join(messagesDir, 'processed');
        if (!fs.existsSync(processedDir)) fs.mkdirSync(processedDir);
        fs.renameSync(path.join(messagesDir, file), path.join(processedDir, file));
      } catch (err) {
        console.error('Error processing', file, err);
      }
    }
  }
}
