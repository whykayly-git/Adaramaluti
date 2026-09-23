const FLW_BASE_URL = "https://api.flutterwave.com/v3";

function getSecretKey(): string {
  const key = process.env.FLUTTERWAVE_SECRET_KEY;
  if (!key) {
    throw new Error(
      "FLUTTERWAVE_SECRET_KEY is not set. Add it to your .env.local file (see .env.example)."
    );
  }
  return key;
}

interface InitializeParams {
  email: string;
  name: string;
  amount: number;
  currency: string;
  txRef: string;
  redirectUrl: string;
  metadata?: Record<string, unknown>;
}

export async function initializeFlutterwavePayment(params: InitializeParams) {
  const res = await fetch(`${FLW_BASE_URL}/payments`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getSecretKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tx_ref: params.txRef,
      amount: params.amount,
      currency: params.currency,
      redirect_url: params.redirectUrl,
      customer: { email: params.email, name: params.name },
      customizations: {
        title: "Adaramaluti House of Fashion",
        description: "Order payment",
      },
      meta: params.metadata,
    }),
  });

  const data = await res.json();
  if (!res.ok || data.status !== "success") {
    throw new Error(data.message ?? "Failed to initialize Flutterwave payment");
  }

  return data.data as { link: string };
}

export async function verifyFlutterwaveTransaction(transactionId: string) {
  const res = await fetch(
    `${FLW_BASE_URL}/transactions/${encodeURIComponent(transactionId)}/verify`,
    {
      headers: { Authorization: `Bearer ${getSecretKey()}` },
    }
  );

  const data = await res.json();
  if (!res.ok || data.status !== "success") {
    throw new Error(data.message ?? "Failed to verify Flutterwave transaction");
  }

  const successful = data.data.status === "successful";
  return { successful, raw: data.data };
}
