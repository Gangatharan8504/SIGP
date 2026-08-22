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

/**
 * Transactional Technical & Soft Skills Matrix Change Notification
 */
const sendSkillMatrixEmail = async ({ to, name, actionType = "ADDED", skill, previousValues = null }) => {
  const appUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const timestamp = new Date().toLocaleString();

  const isSoftSkill =
    (skill.category || "").toLowerCase().includes("soft") ||
    (skill.category || "").toLowerCase().includes("aptitude") ||
    (skill.category || "").toLowerCase().includes("communication");
  const skillTypeLabel = isSoftSkill ? "Soft Skill / Behavioral Competency" : "Technical Core Skill";

  let actionTitle = "Skill Added to Matrix";
  let actionColor = "#059669";
  let badgeText = "NEW SKILL REGISTERED";

  if (actionType === "UPDATED") {
    actionTitle = "Skill Proficiency Updated";
    actionColor = "#2563eb";
    badgeText = "SKILL RATING MODIFIED";
  } else if (actionType === "DELETED") {
    actionTitle = "Skill Removed from Matrix";
    actionColor = "#e11d48";
    badgeText = "SKILL DELETED";
  }

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /><title>${actionTitle}</title></head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="padding: 25px 0;">
    <tr>
      <td align="center">
        <table border="0" cellpadding="0" cellspacing="0" width="600" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
          <tr>
            <td style="background-color: #e11d48; padding: 26px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 20px; font-weight: 800; letter-spacing: -0.5px;">SGIP SKILLS MATRIX</h1>
              <p style="margin: 4px 0 0; color: #ffe4e6; font-size: 12px; font-weight: 500;">Technical &amp; Soft Skills Competency Intelligence</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px;">
              <div style="display: inline-block; background-color: #fff1f2; border: 1px solid #fecdd3; border-radius: 20px; padding: 4px 12px; font-size: 11px; font-weight: 700; color: #9f1239; margin-bottom: 12px;">
                ${badgeText}
              </div>
              <h2 style="margin: 0 0 12px; color: #0f172a; font-size: 17px; font-weight: 700;">${actionTitle}</h2>
              <p style="margin: 0 0 20px; font-size: 13px; color: #475569; line-height: 1.6;">
                Hello <strong>${name}</strong>, your SGIP Technical &amp; Soft Skills Matrix was modified on <strong>${timestamp}</strong>. Below are the registered competency details:
              </p>

              <table border="0" cellpadding="10" cellspacing="0" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 20px;">
                <tr>
                  <td width="35%" style="font-size: 12px; font-weight: 600; color: #64748b;">Skill Name:</td>
                  <td width="65%" style="font-size: 13px; font-weight: 700; color: #0f172a;">${skill.skillName}</td>
                </tr>
                <tr>
                  <td style="font-size: 12px; font-weight: 600; color: #64748b; border-top: 1px solid #e2e8f0;">Category / Domain:</td>
                  <td style="font-size: 13px; font-weight: 600; color: #0f172a; border-top: 1px solid #e2e8f0;">${skill.category || "Technical"} (${skillTypeLabel})</td>
                </tr>
                <tr>
                  <td style="font-size: 12px; font-weight: 600; color: #64748b; border-top: 1px solid #e2e8f0;">Proficiency Tier:</td>
                  <td style="font-size: 13px; font-weight: 700; color: ${actionColor}; border-top: 1px solid #e2e8f0;">
                    ${skill.proficiency || "Intermediate"}
                    ${previousValues && previousValues.proficiency && previousValues.proficiency !== skill.proficiency ? `<span style="font-size: 11px; color: #94a3b8; text-decoration: line-through;"> (was ${previousValues.proficiency})</span>` : ""}
                  </td>
                </tr>
                <tr>
                  <td style="font-size: 12px; font-weight: 600; color: #64748b; border-top: 1px solid #e2e8f0;">Self Assessment Rating:</td>
                  <td style="font-size: 13px; font-weight: 700; color: #d97706; border-top: 1px solid #e2e8f0;">
                    ${skill.selfRating || 3} / 5 Stars
                    ${previousValues && previousValues.selfRating && previousValues.selfRating !== skill.selfRating ? `<span style="font-size: 11px; color: #94a3b8; text-decoration: line-through;"> (was ${previousValues.selfRating}/5)</span>` : ""}
                  </td>
                </tr>
                <tr>
                  <td style="font-size: 12px; font-weight: 600; color: #64748b; border-top: 1px solid #e2e8f0;">Assessment Verification:</td>
                  <td style="font-size: 13px; font-weight: 700; color: ${skill.verifiedViaAssessment ? "#059669" : "#64748b"}; border-top: 1px solid #e2e8f0;">
                    ${skill.verifiedViaAssessment ? `✓ Verified by Proctored Exam (${skill.verifiedScore}%)` : "Self-Reported (Take Assessment to Verify)"}
                  </td>
                </tr>
              </table>

              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 25px 0 10px;">
                <tr>
                  <td align="center">
                    <a href="${appUrl}/skills" target="_blank" style="background-color: #e11d48; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 700; padding: 12px 28px; border-radius: 8px; display: inline-block;">
                      View Full Skills Matrix &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 16px 30px; text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #94a3b8;">
                &copy; ${new Date().getFullYear()} SGIP Placement Intelligence System. Automated Competency Audit.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `SGIP SKILLS MATRIX UPDATE\nHello ${name},\nYour skills matrix was updated on ${timestamp}:\nAction: ${actionTitle}\nSkill: ${skill.skillName} (${skill.category})\nProficiency: ${skill.proficiency}\nRating: ${skill.selfRating}/5\n\nReview at: ${appUrl}/skills`;

  return await sendEmail({
    to,
    subject: `Skills Matrix Notification: ${actionTitle} - ${skill.skillName}`,
    text,
    html,
  });
};

/**
 * Transactional Examination Result & Section Score Report Email
 */
const sendExamResultEmail = async ({
  to,
  name,
  examTitle,
  score = 0,
  maxScore = 96,
  percentage = 0,
  passed = false,
  integrityScore = 100,
  timeSpentFormatted = "00:00:00",
  sectionScores = {},
  attemptNumber = 1,
}) => {
  const appUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const timestamp = new Date().toLocaleString();

  const sectionRows = Object.entries(sectionScores).map(([key, val]) => {
    const formattedName = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
    const earned = typeof val === 'object' ? (val.score || 0) : val;
    const max = typeof val === 'object' ? (val.maxScore || 20) : 20;
    return `
      <tr>
        <td style="padding: 10px 14px; border-bottom: 1px solid #ffe4e6; font-size: 13px; font-weight: 600; color: #881337;">${formattedName}</td>
        <td style="padding: 10px 14px; border-bottom: 1px solid #ffe4e6; font-size: 13px; font-weight: 700; color: #0f172a; text-align: center;">${earned.toFixed(2)} / ${max.toFixed(2)}</td>
      </tr>
    `;
  }).join('');

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /><title>Exam Score Report: ${examTitle}</title></head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="padding: 25px 0;">
    <tr>
      <td align="center">
        <table border="0" cellpadding="0" cellspacing="0" width="600" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
          <tr>
            <td style="background-color: #e11d48; padding: 28px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 800;">SGIP EXAMINATION REPORT</h1>
              <p style="margin: 4px 0 0; color: #ffe4e6; font-size: 12px; font-weight: 500;">Proctored Assessment Benchmark &amp; Scorecard</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px;">
              <div style="display: inline-block; background-color: ${passed ? "#ecfdf5" : "#fff1f2"}; border: 1px solid ${passed ? "#a7f3d0" : "#fecdd3"}; border-radius: 20px; padding: 4px 12px; font-size: 11px; font-weight: 700; color: ${passed ? "#065f46" : "#9f1239"}; margin-bottom: 12px;">
                ${passed ? "BENCHMARK CLEARED" : "EVALUATION COMPLETED"} • ATTEMPT ${attemptNumber} OF 3
              </div>
              <h2 style="margin: 0 0 8px; color: #0f172a; font-size: 18px; font-weight: 700;">${examTitle}</h2>
              <p style="margin: 0 0 20px; font-size: 13px; color: #475569; line-height: 1.6;">
                Hello <strong>${name}</strong>, your proctored examination attempt has been graded and verified on <strong>${timestamp}</strong>. Below is your official scorecard:
              </p>

              <!-- Main Score Gauge Box -->
              <table border="0" cellpadding="15" cellspacing="0" width="100%" style="background-color: #fff1f2; border: 1px solid #fecdd3; border-radius: 10px; margin-bottom: 24px; text-align: center;">
                <tr>
                  <td width="33%" style="border-right: 1px solid #fecdd3;">
                    <div style="font-size: 11px; font-weight: 700; color: #9f1239; text-transform: uppercase;">Total Score</div>
                    <div style="font-size: 24px; font-weight: 900; color: #e11d48; margin-top: 4px;">${score.toFixed(2)} / ${maxScore.toFixed(2)}</div>
                    <div style="font-size: 11px; color: #881337; font-weight: 600;">${percentage}% Percentage</div>
                  </td>
                  <td width="33%" style="border-right: 1px solid #fecdd3;">
                    <div style="font-size: 11px; font-weight: 700; color: #065f46; text-transform: uppercase;">Integrity Score</div>
                    <div style="font-size: 24px; font-weight: 900; color: #059669; margin-top: 4px;">${integrityScore}%</div>
                    <div style="font-size: 11px; color: #047857; font-weight: 600;">Proctored Audit</div>
                  </td>
                  <td width="33%">
                    <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase;">Time Spent</div>
                    <div style="font-size: 18px; font-weight: 800; color: #1e293b; margin-top: 6px;">${timeSpentFormatted}</div>
                    <div style="font-size: 11px; color: #64748b; font-weight: 600;">Active Session</div>
                  </td>
                </tr>
              </table>

              <!-- Section Breakdown Table -->
              <h3 style="margin: 0 0 10px; font-size: 14px; font-weight: 700; color: #0f172a;">Section-Wise Performance Breakdown</h3>
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; margin-bottom: 22px;">
                <thead>
                  <tr style="background-color: #ffe4e6; text-align: left;">
                    <th style="padding: 10px 14px; font-size: 12px; color: #9f1239;">Section Name</th>
                    <th style="padding: 10px 14px; font-size: 12px; color: #9f1239; text-align: center;">Score Earned</th>
                  </tr>
                </thead>
                <tbody>
                  ${sectionRows}
                </tbody>
              </table>

              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 25px 0 10px;">
                <tr>
                  <td align="center">
                    <a href="${appUrl}/assessments" target="_blank" style="background-color: #e11d48; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 700; padding: 13px 30px; border-radius: 8px; display: inline-block;">
                      View Assessment History &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 16px 30px; text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #94a3b8;">
                &copy; ${new Date().getFullYear()} SGIP Institutional Placement Intelligence System. Automated Score Dispatch.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `SGIP EXAM SCORE REPORT\nExam: ${examTitle}\nScore: ${score.toFixed(2)} / ${maxScore.toFixed(2)} (${percentage}%)\nIntegrity: ${integrityScore}%\nTime Spent: ${timeSpentFormatted}\n\nView at: ${appUrl}/assessments`;

  return await sendEmail({
    to,
    subject: `Exam Score Report: ${examTitle} - Score ${score.toFixed(2)}/${maxScore.toFixed(2)} (${percentage}%)`,
    text,
    html,
  });
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendProfileChangeEmail,
  sendSkillMatrixEmail,
  sendExamResultEmail,
};

