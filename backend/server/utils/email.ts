export async function sendEmail(
  scriptUrl: string,
  to: string,
  subject: string,
  body: string
): Promise<boolean> {
  if (!scriptUrl) {
    console.warn('No GOOGLE_SCRIPT_URL provided, skipping email send.');
    console.log(`[EMAIL PREVIEW] To: ${to} | Subject: ${subject}\n${body}`);
    return true; // Simulate success
  }

  try {
    const res = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'sendEmail',
        to,
        subject,
        body,
        isHtml: true
      })
    });
    
    if (!res.ok) {
      console.error('Failed to send email:', await res.text());
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}
