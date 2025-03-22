import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('send-otp')
  async sendOtp(@Body() body: { method: 'mail' | 'sms'; to: string; language: 'es' | 'en' }) {
    const { method, to, language } = body;

    if (!method || !to || !language) {
      throw new BadRequestException('Faltan parámetros obligatorios: method, to, language.');
    }

    if (!['mail', 'sms'].includes(method)) {
      throw new BadRequestException(`Método no soportado: ${method}`);
    }

    try {
      const result = await this.notificationService.sendOtp(method, to, language);
      return { message: 'OTP enviado con éxito', result };
    } catch (error) {
      throw new BadRequestException(`Error al enviar el OTP: ${error.message}`);
    }
  }
}
