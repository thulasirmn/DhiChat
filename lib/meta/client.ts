import { env } from "@/lib/utils/env";

type SendInput = {
  recipientId: string;
  message: string;
  accessToken: string;
};

export async function sendMetaMessage({ recipientId, message, accessToken }: SendInput): Promise<{ id: string }> {
  const url = `${env.META_GRAPH_BASE_URL}/${env.META_GRAPH_API_VERSION}/me/messages`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      recipient: { id: recipientId },
      messaging_type: "RESPONSE",
      message: { text: message },
      access_token: accessToken
    })
  });

  if (!response.ok) {
    const data = await response.text();
    throw new Error(`Meta send failed: ${response.status} ${data}`);
  }

  const data = (await response.json()) as { message_id?: string };
  return { id: data.message_id ?? crypto.randomUUID() };
}
