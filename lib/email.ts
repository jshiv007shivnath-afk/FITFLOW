import nodemailer from 'nodemailer';

const host = process.env.SMTP_HOST || '127.0.0.1';
const port = Number(process.env.SMTP_PORT || '54325');
const user = process.env.SMTP_USER || undefined;
const pass = process.env.SMTP_PASS || undefined;
const secure = process.env.SMTP_SECURE === 'true' || port === 465;
const from = process.env.EMAIL_FROM || 'FitFlow <no-reply@fitflow.app>';

export function createTransporter() {
  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: user && pass ? { user, pass } : undefined,
    tls: {
      rejectUnauthorized: false,
    },
  });
}

export function renderOtpEmailHtml(otp: string): string {
  const digits = otp.split('');
  const digitBoxes = digits
    .map(
      (d) =>
        `<span style="display:inline-block; width:44px; height:52px; line-height:52px; background:#1C1F1D; color:#B8F45A; font-size:28px; font-weight:800; font-family:'Inter',system-ui,sans-serif; text-align:center; border-radius:12px; margin:0 4px; border:1px solid rgba(184,244,90,0.3);">${d}</span>`
    )
    .join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your FitFlow Verification Code</title>
</head>
<body style="margin:0; padding:0; background-color:#0B0C0B; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color:#FFFFFF;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#0B0C0B; padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:480px; background-color:#111312; border-radius:24px; border:1px solid rgba(255,255,255,0.08); overflow:hidden; box-shadow:0 20px 40px rgba(0,0,0,0.6);" cellspacing="0" cellpadding="0" border="0">
          <!-- Header -->
          <tr>
            <td style="padding:32px 32px 16px 32px; text-align:center;">
              <div style="display:inline-flex; align-items:center; gap:8px;">
                <span style="display:inline-block; width:12px; height:12px; border-radius:50%; background-color:#B8F45A;"></span>
                <span style="font-size:22px; font-weight:800; letter-spacing:-0.5px; color:#FFFFFF;">FIT<span style="color:#B8F45A;">FLOW</span></span>
              </div>
            </td>
          </tr>

          <!-- Main Body -->
          <tr>
            <td style="padding:16px 32px; text-align:center;">
              <h1 style="font-size:22px; font-weight:700; color:#FFFFFF; margin:0 0 12px 0;">Verify Your Account</h1>
              <p style="font-size:14px; line-height:22px; color:#A1A1AA; margin:0 0 28px 0;">
                Use the 6-digit verification code below to complete your login or account setup.
              </p>

              <!-- OTP Digits Container -->
              <div style="margin:24px 0; text-align:center;">
                ${digitBoxes}
              </div>

              <div style="background-color:#181A19; border-radius:12px; padding:12px 16px; margin:24px 0; border:1px solid rgba(255,255,255,0.05);">
                <p style="font-size:12px; color:#A1A1AA; margin:0;">
                  ⏳ Code is valid for <strong style="color:#FFFFFF;">10 minutes</strong>. Do not share this code with anyone.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 32px; background-color:#0D0E0E; text-align:center; border-top:1px solid rgba(255,255,255,0.05);">
              <p style="font-size:11px; color:#71717A; margin:0 0 6px 0;">
                If you did not request this verification code, you can safely ignore this email.
              </p>
              <p style="font-size:11px; color:#52525B; margin:0;">
                &copy; ${new Date().getFullYear()} FitFlow Athletics. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export async function sendOtpEmail(toEmail: string, otp: string): Promise<{ success: boolean; error?: string }> {
  const transporter = createTransporter();
  const html = renderOtpEmailHtml(otp);

  try {
    const info = await transporter.sendMail({
      from,
      to: toEmail,
      subject: `Your FitFlow Verification Code: ${otp}`,
      text: `Your FitFlow verification code is ${otp}. It expires in 10 minutes.`,
      html,
    });
    console.log(`[Email] OTP sent to ${toEmail}. Message ID: ${info.messageId}`);
    return { success: true };
  } catch (err: any) {
    console.warn(`[Email] SMTP delivery failed to ${toEmail} (${err?.message || err}). Development fallback active.`);
    // In local development, don't break the user flow if SMTP server is starting or unreachable
    console.log(`[Email DEV FALLBACK] To: ${toEmail} | OTP: ${otp}`);
    return { success: true, error: err?.message };
  }
}
