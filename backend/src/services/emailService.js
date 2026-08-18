const nodemailer = require("nodemailer");

let transporter = null;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER || "cooperative.team8503@gmail.com",
        pass: process.env.SMTP_PASS || "smojmmngxobpgpuf",
      },
    });
  }
  return transporter;
};

/**
 * Send an email with transactional inbox deliverability headers
 */
const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const transport = getTransporter();
    const smtpEmail = process.env.SMTP_USER || "cooperative.team8503@gmail.com";

    const mailOptions = {
      from: `"SGIP Placement Platform" <${smtpEmail}>`,
      replyTo: smtpEmail,
      to,
      subject,
      text: text || "Your SGIP Student Growth & Placement Platform notification.",
      html,
      headers: {
        "X-Mailer": "SGIP-Educational-Platform",
        "X-Priority": "3",
        "List-Unsubscribe": `<mailto:${smtpEmail}?subject=unsubscribe>`,
        "Precedence": "bulk",
      },
    };

    const info = await transport.sendMail(mailOptions);
    console.log(`[Email Service] Delivered message to ${to} (MessageId: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[Email Service] Delivery error to ${to}:`, error.message);
    return { success: false, error: error.message };
  }
};

/**
 * High-deliverability transactional welcome email (Primary Inbox Optimized)
 */
const sendWelcomeEmail = async ({ to, name, role = "student", department, rollNumber }) => {
  const roleLabel =
    role.toLowerCase() === "faculty"
      ? "Faculty Advisor"
      : role.toLowerCase() === "placement_coordinator"
      ? "Placement Coordinator"
      : "Student Candidate";

  const appUrl = process.env.FRONTEND_URL || "http://localhost:5173";

  const html = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SGIP Account Confirmation</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed; background-color: #f8fafc; padding: 25px 0;">
    <tr>
      <td align="center">
        <table border="0" cellpadding="0" cellspacing="0" width="600" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
          <tr>
            <td style="background-color: #e11d48; padding: 32px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">SGIP PLATFORM</h1>
              <p style="margin: 6px 0 0; color: #ffe4e6; font-size: 13px; font-weight: 500;">Student Growth Intelligence &amp; Placement System</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 35px 30px;">
              <h2 style="margin: 0 0 16px; color: #0f172a; font-size: 18px; font-weight: 700;">Account Created: Welcome, ${name}</h2>
              <p style="margin: 0 0 20px; font-size: 14px; line-height: 1.6; color: #475569;">
                Your account on the SGIP Placement Intelligence Platform has been successfully activated. You can now access skill gap diagnostics, academic records, and upcoming campus placement opportunities.
              </p>
              <table border="0" cellpadding="10" cellspacing="0" width="100%" style="background-color: #fff1f2; border: 1px solid #fecdd3; border-radius: 8px; margin-bottom: 24px;">
                <tr>
                  <td width="35%" style="font-size: 13px; font-weight: 600; color: #9f1239;">Account Type:</td>
                  <td width="65%" style="font-size: 13px; font-weight: 700; color: #881337;">${roleLabel}</td>
                </tr>
                <tr>
                  <td style="font-size: 13px; font-weight: 600; color: #9f1239; border-top: 1px solid #ffe4e6;">Registered Email:</td>
                  <td style="font-size: 13px; font-weight: 700; color: #881337; border-top: 1px solid #ffe4e6;">${to}</td>
                </tr>
                ${department ? `
                <tr>
                  <td style="font-size: 13px; font-weight: 600; color: #9f1239; border-top: 1px solid #ffe4e6;">Department:</td>
                  <td style="font-size: 13px; font-weight: 700; color: #881337; border-top: 1px solid #ffe4e6;">${department}</td>
                </tr>` : ""}
                ${rollNumber ? `
                <tr>
                  <td style="font-size: 13px; font-weight: 600; color: #9f1239; border-top: 1px solid #ffe4e6;">Student ID:</td>
                  <td style="font-size: 13px; font-weight: 700; color: #881337; border-top: 1px solid #ffe4e6;">${rollNumber}</td>
                </tr>` : ""}
              </table>
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 25px 0 15px;">
                <tr>
                  <td align="center">
                    <a href="${appUrl}/dashboard" target="_blank" style="background-color: #e11d48; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 700; padding: 13px 32px; border-radius: 8px; display: inline-block;">
                      Access SGIP Portal &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 30px; text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #94a3b8;">
                &copy; ${new Date().getFullYear()} SGIP Institutional Placement Intelligence System. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const plainText = `SGIP PLATFORM — ACCOUNT CONFIRMATION\nHello ${name},\nYour account has been activated.\nEmail: ${to}\nPortal: ${appUrl}/login`;

  return await sendEmail({
    to,
    subject: `SGIP Account Confirmation: Welcome ${name}`,
    text: plainText,
    html,
  });
};

/**
 * Transactional Profile Change Notification with Field Diffs
 */
const sendProfileChangeEmail = async ({ to, name, changes = [] }) => {
  if (!changes || changes.length === 0) return;

  const appUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const timestamp = new Date().toLocaleString();

  const rowsHtml = changes
    .map(
      (c) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #ffe4e6; font-weight: 600; color: #881337; font-size: 13px;">${c.field}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ffe4e6; color: #64748b; font-size: 13px; text-decoration: line-through;">${c.oldValue !== null && c.oldValue !== undefined ? c.oldValue : "None"}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ffe4e6; font-weight: 700; color: #059669; font-size: 13px;">${c.newValue !== null && c.newValue !== undefined ? c.newValue : "Cleared"}</td>
    </tr>`
    )
    .join("");

  const rowsText = changes
    .map((c) => `- ${c.field}: ${c.oldValue || "None"} → ${c.newValue || "Cleared"}`)
    .join("\n");

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /><title>Profile Updated Successfully</title></head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="padding: 25px 0;">
    <tr>
      <td align="center">
        <table border="0" cellpadding="0" cellspacing="0" width="600" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
          <tr>
            <td style="background-color: #e11d48; padding: 24px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 20px; font-weight: 800;">PROFILE AUDIT NOTIFICATION</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px;">
              <h2 style="margin: 0 0 12px; color: #0f172a; font-size: 16px; font-weight: 700;">Profile Updated Successfully</h2>
              <p style="margin: 0 0 20px; font-size: 13px; color: #475569; line-height: 1.6;">
                Hello <strong>${name}</strong>, your SGIP student candidate profile was modified on <strong>${timestamp}</strong>. Below is the audited list of field modifications:
              </p>

              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fff1f2; border: 1px solid #fecdd3; border-radius: 8px; overflow: hidden; margin-bottom: 20px;">
                <thead>
                  <tr style="background-color: #ffe4e6; text-align: left;">
                    <th style="padding: 10px; font-size: 12px; color: #9f1239;">Field</th>
                    <th style="padding: 10px; font-size: 12px; color: #9f1239;">Previous Value</th>
                    <th style="padding: 10px; font-size: 12px; color: #9f1239;">Updated Value</th>
                  </tr>
                </thead>
                <tbody>
                  ${rowsHtml}
                </tbody>
              </table>

              <p style="margin: 20px 0 0; font-size: 11px; color: #64748b;">
                If you did not authorize this modification, please review your account activity or notify your department coordinator immediately.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `SGIP PROFILE UPDATED\nHello ${name},\nYour profile was updated on ${timestamp}:\n\n${rowsText}\n\nReview at: ${appUrl}/dashboard`;

  return await sendEmail({
    to,
    subject: `Profile Updated Successfully - SGIP Audit (${changes.length} fields changed)`,
    text,
    html,
  });
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendProfileChangeEmail,
};
