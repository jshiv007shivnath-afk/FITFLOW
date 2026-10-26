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
  const digitSpans = digits
    .map(
      (d) =>
        `<span style="display:inline-block; margin:0 2px; font-weight:700;">${d}</span>`
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
<body style="margin:0; padding:0; background-color:#F6F8FA; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color:#24292F; -webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#F6F8FA; padding:40px 16px;">
    <tr>
      <td align="center">
        <!-- Letter Sheet -->
        <table role="presentation" width="100%" style="max-width:540px; background-color:#FFFFFF; border:1px solid #D0D7DE; border-radius:8px; box-shadow:0 1px 3px rgba(31,35,40,0.06); text-align:left;" cellspacing="0" cellpadding="0" border="0">
          
          <!-- Letterhead -->
          <tr>
            <td style="padding:28px 36px 20px 36px; border-bottom:1px solid #EAECEF;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td>
                    <div style="display:inline-flex; align-items:center; gap:8px;">
                      <span style="display:inline-block; width:10px; height:10px; border-radius:50%; background-color:#B8F45A; border:2px solid #111312;"></span>
                      <span style="font-size:18px; font-weight:800; letter-spacing:-0.3px; color:#111312; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
                        FIT<span style="color:#B8F45A;">FLOW</span>
                      </span>
                    </div>
                  </td>
                  <td align="right" style="font-size:12px; color:#57606A; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
                    Security Notification
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Letter Content -->
          <tr>
            <td style="padding:32px 36px 24px 36px;">
              <p style="font-size:15px; line-height:24px; color:#24292F; margin:0 0 16px 0; font-weight:600;">
                Hello,
              </p>
              <p style="font-size:14px; line-height:22px; color:#57606A; margin:0 0 24px 0;">
                We received a request to authenticate your <strong>FitFlow</strong> account. Please use the following 6-digit verification code:
              </p>

              <!-- GitHub-Style Monospace Code Box -->
              <div style="margin:24px 0 28px 0; text-align:center;">
                <div style="display:inline-block; background-color:#F6F8FA; border:1px solid #D0D7DE; border-radius:6px; padding:16px 32px;">
                  <span style="font-size:32px; font-weight:700; letter-spacing:6px; font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace; color:#111312;">
                    ${digitSpans}
                  </span>
                </div>
              </div>

              <p style="font-size:13px; line-height:20px; color:#57606A; margin:0 0 16px 0;">
                This code will expire in <strong>10 minutes</strong>. For your security, never share this code with anyone.
              </p>

              <p style="font-size:13px; line-height:20px; color:#57606A; margin:0 0 28px 0;">
                If you did not make this request, you can safely ignore this email. Someone may have entered your email address by mistake.
              </p>

              <p style="font-size:14px; line-height:22px; color:#24292F; margin:0;">
                Thanks,<br />
                <strong style="color:#111312;">The FitFlow Team</strong>
              </p>
            </td>
          </tr>

          <!-- Official Footer -->
          <tr>
            <td style="padding:20px 36px; background-color:#F6F8FA; border-top:1px solid #EAECEF; border-bottom-left-radius:8px; border-bottom-right-radius:8px;">
              <p style="font-size:11px; line-height:16px; color:#6E7781; margin:0;">
                FitFlow Athletics · Automated Security Service<br />
                This is a required security notification sent to authenticate your account.
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
  const html = renderOtpEmailHtml(otp);

  // 1. Production Delivery via Resend (if RESEND_API_KEY is configured in Vercel or .env)
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || 'FitFlow <onboarding@resend.dev>',
          to: [toEmail],
          subject: `Your FitFlow Verification Code: ${otp}`,
          text: `Your FitFlow verification code is ${otp}. It expires in 10 minutes.`,
          html,
        }),
      });

      const resendData = await res.json().catch(() => ({}));
      if (res.ok && resendData.id) {
        console.log(`[Resend] OTP delivered successfully to ${toEmail}. ID: ${resendData.id}`);
        return { success: true };
      }
      console.warn('[Resend] Delivery warning:', resendData);
    } catch (resendErr) {
      console.error('[Resend] API connection error:', resendErr);
    }
  }

  // 2. Local & Docker Delivery via Nodemailer (Supabase Mailpit port 54325)
  const transporter = createTransporter();

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
    console.log(`[Email DEV FALLBACK] To: ${toEmail} | OTP: ${otp}`);
    return { success: true, error: err?.message };
  }
}
