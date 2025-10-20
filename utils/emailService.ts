import nodemailer, { Transporter } from 'nodemailer';

interface EmailData {
  to: string;
  subject: string;
  html: string;
}

interface FormData {
  name: string;
  company: string;
  phone: string;
  email: string;
  description: string;
}

class EmailService {
  private transporter: Transporter;
  private static instance: EmailService;

  private constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  public async sendEmail({ to, subject, html }: EmailData): Promise<{ success: boolean; error?: any }> {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_USER,
        to,
        subject,
        html,
      });
      return { success: true };
    } catch (error) {
      console.error('Email sending failed:', error);
      return { success: false, error };
    }
  }

  public generateFormEmailTemplate(formData: FormData): string {
    return `
      <h2>Yeni Ürün Teklif Talebi</h2>
      <p><strong>Ad:</strong> ${formData.name}</p>
      <p><strong>Şirket:</strong> ${formData.company}</p>
      <p><strong>Telefon:</strong> ${formData.phone}</p>
      <p><strong>Email:</strong> ${formData.email}</p>
      <p><strong>Açıklama:</strong> ${formData.description}</p>
      <p><strong>Gönderim Tarihi:</strong> ${new Date().toLocaleString()}</p>
    `;
  }
}

// Export a singleton instance
const emailService = EmailService.getInstance();
export default emailService;
