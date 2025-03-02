export async function pingHealthCheck() {
  try {
    const response = await fetch("/api/health");
    const data = await response.json();
    console.log("Health check:", data.status);
  } catch (error) {
    console.error("Health check failed:", error);
  }
}
