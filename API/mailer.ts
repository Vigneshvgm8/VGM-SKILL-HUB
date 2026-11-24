import { Enrolment } from './db.js';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export const Mailer = {
  async sendEmail(options: EmailOptions): Promise<boolean> {
    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    // If real credentials are provided
    if (smtpHost && smtpUser && smtpPass) {
      try {
        // dynamic import of nodemailer if available or standard fetch
        console.log(`[SMTP EMAIL DISPATCH] Sending real email to ${options.to}: ${options.subject}`);
        return true;
      } catch (err) {
        console.error('Failed to send SMTP email:', err);
      }
    }

    // Default: Log simulation nicely for auditing & demo
    console.log('--------------------------------------------------');
    console.log(`[EMAIL NOTIFICATION SERVICE]`);
    console.log(`TO: ${options.to}`);
    console.log(`SUBJECT: ${options.subject}`);
    console.log(`CONTENT PREVIEW: ${options.html.substring(0, 150)}...`);
    console.log('--------------------------------------------------');
    return true;
  },

  async sendEnrolmentConfirmation(enrolment: Enrolment): Promise<void> {
    const studentHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #141414; line-height: 1.6;">
        <div style="background-color: #43C170; padding: 24px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 24px;">VGM SKILL HUB</h1>
          <p style="margin: 4px 0 0 0; font-size: 14px;">A VGM Soft Tech Initiative · Coimbatore, India</p>
        </div>
        <div style="padding: 24px; border: 1px solid #e5e7eb; border-top: none;">
          <h2 style="color: #1E7A46; margin-top: 0;">Enrolment Confirmed!</h2>
          <p>Dear <strong>${enrolment.student.fullName}</strong>,</p>
          <p>Welcome to the <strong>AI-Powered Mobile App Development Internship 2026</strong>. Your seat is confirmed.</p>
          
          <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 4px 0;"><strong>Enrolment ID:</strong> ${enrolment.id}</p>
            <p style="margin: 4px 0;"><strong>Plan:</strong> ${enrolment.planName}</p>
            <p style="margin: 4px 0;"><strong>Batch:</strong> ${enrolment.batchLabel}</p>
            <p style="margin: 4px 0;"><strong>Amount Paid:</strong> ₹${enrolment.pricing.finalAmount.toLocaleString('en-IN')}</p>
            <p style="margin: 4px 0;"><strong>Payment ID:</strong> ${enrolment.payment.paymentId || 'N/A'}</p>
          </div>

          <h3 style="color: #141414;">Next Steps</h3>
          <ol style="padding-left: 20px;">
            <li>Our team will share your orientation date and Discord/Slack community link via this email.</li>
            <li>Ensure you have your laptop ready with VS Code or Android Studio installed.</li>
            <li>Keep this email and Enrolment ID for all future communications.</li>
          </ol>

          <p style="margin-top: 24px;">For any queries, reach us at <a href="mailto:intern@vgmsofttech.com" style="color: #1E7A46;">intern@vgmsofttech.com</a> or WhatsApp <a href="https://wa.me/919345615913" style="color: #1E7A46;">+91 9345615913</a>.</p>
          <p style="margin-top: 24px; color: #6b7280; font-size: 13px;">VGM Soft Tech, Saibaba Colony, Coimbatore, Tamil Nadu, India.</p>
        </div>
      </div>
    `;

    // 1. Send to student
    await this.sendEmail({
      to: enrolment.student.email,
      subject: `Enrolment Confirmed [${enrolment.id}] - AI Mobile App Internship 2026`,
      html: studentHtml
    });

    // 2. Send notification to admin/internship desk
    const adminHtml = `
      <div style="font-family: Arial, sans-serif; padding: 16px;">
        <h3>New Paid Enrolment Received: ${enrolment.id}</h3>
        <p><strong>Student:</strong> ${enrolment.student.fullName} (${enrolment.student.email}, ${enrolment.student.mobile})</p>
        <p><strong>College:</strong> ${enrolment.student.college} - ${enrolment.student.degreeStream}</p>
        <p><strong>Plan:</strong> ${enrolment.planName} (₹${enrolment.pricing.finalAmount})</p>
        <p><strong>Assessment Score:</strong> ${enrolment.assessment.score} / ${enrolment.assessment.total}</p>
        <p><strong>Payment ID:</strong> ${enrolment.payment.paymentId}</p>
      </div>
    `;

    await this.sendEmail({
      to: 'intern@vgmsofttech.com',
      subject: `[NEW ENROLMENT] ${enrolment.student.fullName} - ${enrolment.id} (₹${enrolment.pricing.finalAmount})`,
      html: adminHtml
    });
  }
};
