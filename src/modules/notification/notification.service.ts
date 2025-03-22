import { Injectable } from '@nestjs/common';
import e from 'express';
import { ExceptionHandler } from 'src/helpers/handlers/exception.handler';
import { MailService } from 'src/shared/mail/mail.service';
import { UtilsShared } from 'src/shared/utils/utils.shared';

@Injectable()
export class NotificationService {
  constructor(
    private readonly mailService: MailService, // Servicio de email
    // private readonly smsService: SmsService, // Servicio de SMS (ejemplo)
  ) {}

  async sendNotification(
    method: 'mail' | 'sms',
    params: {
      to: string;
      subject?: string;
      message?: string;
      template?: string;
      context?: Record<string, any>;
    },
  ) {
    try {
      if (method === 'mail') {
        return await this.mailService.sendEmail({
          to: params.to,
          subject: params.subject || 'Notification',
          template: params.template,
          context: params.context,
        });
      }
      // else if (method === 'sms') {
      //   // Enviar notificación por SMS
      //   return await this.smsService.sendSms({
      //     to: params.to,
      //     message: params.message,
      //   });
      // }
      // Puedes agregar más métodos (WhatsApp, etc.)
      else {
        throw new Error(`Método de notificación no soportado: ${method}`);
      }
    } catch (error) {
      console.error('Error al enviar la notificación:', error.message);
      throw new Error(`No se pudo enviar la notificación: ${error.message}`);
    }
  }

  async sendOtp(to: string, otp: string, language: 'es' | 'en' = 'es') {
    try {
      const subject = language === 'es' ? 'Tu código de verificación' : 'Your Verification Code';
      const template = language === 'es' ? './otp-es' : './otp-en';
      const context = { otp };

      return this.sendNotification('mail', {
        to,
        subject,
        template,
        context,
      });
    } catch (error) {
      throw new ExceptionHandler(error);
    }
  }
}
