import { Injectable } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { ExtraReplyMessage } from 'telegraf/typings/telegram-types';

import { getTelegramConfig } from '@/config/telegram.config';

import { TelegramOptions } from './telegram.interface';

@Injectable()
export class TelegramService {
  bot: Telegraf;
  options: TelegramOptions;

  constructor() {
    this.options = getTelegramConfig();
    this.bot = new Telegraf(this.options.token);
  }

  async sendMessage(
    message: string,
    options?: ExtraReplyMessage,
    chatId: string = this.options.chatId
  ) {
    await this.bot.telegram.sendMessage(chatId, message, {
      parse_mode: 'HTML',
      ...options,
    });
  }

  async sendPhoto(
    photo: string,
    message?: string,
    chatId: string = this.options.chatId
  ) {
    await this.bot.telegram.sendPhoto(chatId, photo, {
      caption: message,
    });
  }
}
