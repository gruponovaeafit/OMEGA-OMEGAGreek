export default async function verifyRecaptchaEnterprise(
  token: string,
): Promise<boolean> {
  const apiKey = process.env.RECAPTCHA_ENTERPRISE_API_KEY;
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  const project = process.env.RECAPTCHA_PROYECT;
  const url = `https://recaptchaenterprise.googleapis.com/v1/projects/${project}/assessments?key=${apiKey}`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: {
          token,
          siteKey,
          expectedAction: "LOGIN",
        },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    const data = await res.json();
    const isValid =
      data.tokenProperties?.valid === true && data.riskAnalysis?.score >= 0.5;

    if (!isValid) {
      console.warn("⚠️ reCAPTCHA inválido o score bajo:", data);
    }

    return isValid;
  } catch (err) {
    if (err instanceof Error) {
      console.error("❌ Error verificando reCAPTCHA:", err.message);
    } else {
      console.error("❌ Error verificando reCAPTCHA:", err);
    }
    return false;
  }
}
