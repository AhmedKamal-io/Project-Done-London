// lib/fetchArticles.ts
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

export default async function fetchArticles() {
  try {
    const res = await fetch(`${baseUrl}/api/articles`, { cache: "no-store" });

    if (!res.ok) throw new Error("Failed to fetch articles");

    const json = await res.json();

    // نرجع array من articles من داخل json.data
    if (json && Array.isArray(json.data)) return json.data;

    console.warn(
      "Unexpected API response, expected array in json.data but got:",
      json
    );
    return [];
  } catch (error) {
    console.error("Failed to load articles:", error);
    return [];
  }
}
