"use client";
import { useSearchParams } from "next/navigation";

export default function ViewPaste() {
  const searchParams = useSearchParams();
  const data = searchParams.get("data");
  let decoded = "";
  let error = "";

  if (!data) {
    error = "No paste data found in the URL.";
  } else {
    try {
      decoded = decodeURIComponent(escape(atob(decodeURIComponent(data))));
    } catch (e) {
      error = "Invalid or corrupted paste data.";
    }
  }

  return (
    <main style={{ maxWidth: 600, margin: "2rem auto", padding: 24 }}>
      <h1 style={{ textAlign: "center" }}>View Paste</h1>
      {error ? (
        <div style={{ color: "red", textAlign: "center" }}>{error}</div>
      ) : (
        <pre style={{ background: "#f4f4f4", padding: 16, borderRadius: 8, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
          {decoded}
        </pre>
      )}
    </main>
  );
} 