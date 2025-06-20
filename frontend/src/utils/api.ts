// next public api base url
export const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface ConversationMessage {
  role: string;
  content: string;
}

export interface RunNodeRequest {
  conversation: ConversationMessage[];
  output_schema?: any;
}

export interface BackendMessage {
  content: string;
  role: string;
  structured_data?: Record<string, any>;
  decision?: boolean;
}

export interface RunNodeResponse {
  success: boolean;
  messages?: {
    output_message: BackendMessage;
    thinking_process: BackendMessage[];
  };
}

export const runNode = async (request: RunNodeRequest): Promise<RunNodeResponse> => {
  console.log("url:", `${backendUrl}/run-node`);
  const response = await fetch(`${backendUrl}/run-node`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};