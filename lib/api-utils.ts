// Utility functions to safely call APIs without exposing keys
// All API keys are stored securely and never exposed to frontend

export async function callApi(endpoint: string, params?: Record<string, string>) {
  try {
    const response = await fetch("/api/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ endpoint, params }),
    })

    if (!response.ok) {
      throw new Error("API request failed")
    }

    return await response.json()
  } catch (error) {
    throw new Error("Failed to fetch data")
  }
}

export function formatApiResponse(data: any): string {
  try {
    if (!data || Object.keys(data).length === 0) {
      return "No data found"
    }

    if (data.error) {
      return JSON.stringify(data, null, 2)
    }

    return JSON.stringify(data, null, 2)
  } catch (error) {
    return "Unable to format data"
  }
}
