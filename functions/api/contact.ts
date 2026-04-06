interface Env {
  RESEND_API_KEY: string;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  if (context.request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const data = await context.request.json();

    // TODO: Validate required fields (name, email, message)
    // TODO: Send email via Resend API using context.env.RESEND_API_KEY
    // TODO: Send notification to internal Slack/WhatsApp

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Thank you! We will contact you soon.',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  } catch {
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Something went wrong. Please try again.',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
};
