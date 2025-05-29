import axios from 'axios';


interface SessionResponse {
  url: string;
  // Add other session response fields if needed
}

interface CreateSessionParams {
  workflowId: string;
  callback: string;
  vendorData: string;
}

/**
 * Creates a new verification session using the Didit API (v2).
 */
export async function createSession({
  workflowId,
  callback,
  vendorData,
}: CreateSessionParams): Promise<SessionResponse> {
  try {
    const response = await axios.post<SessionResponse>(
      'https://verification.didit.me/v2/session/',
      {
        workflow_id: workflowId,
        vendor_data: vendorData,
        callback,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': 'your-api-key', // REPLACE WITH YOUR ACTUAL KEY
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Failed to create session: ${error.response?.status} ${JSON.stringify(error.response?.data)}`);
    }
    throw error;
  }
}

// Example usage:
export async function initializeVerification() {
  try {
    const sessionData = await createSession({
      workflowId: 'your-workflow-id',
      callback: 'myapp://callback',
      vendorData: 'your-vendor-data',
    });

    return sessionData.url;
  } catch (error) {
    console.error('Error during verification initialization:', error);
    throw error;
  }
}
