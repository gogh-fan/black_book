import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendVerificationEmail(to: string, code: string): Promise<void> {
    const baseUrl = this.configService.get('BASE_URL');
    const url = `${baseUrl}/email-verify`;

    await this.mailerService.sendMail({
      to,
      from: `"블랙북", <${this.configService.get('EMAIL_USER')}>`,
      subject: '이메일 인증',
      html: `
        가입확인 버튼를 누르시면 가입 인증이 완료됩니다.<br/>
        <form action="${url}" method="get">
          <input type="hidden" name="code" value=${code} />
          <button formtarget="_blank">가입확인</button>
        </form>
      `,
    });
  }
}
