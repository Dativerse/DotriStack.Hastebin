"use client";
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import CryptoJS from "crypto-js";

const ENC_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;

export default function Home() {
  const searchParams = useSearchParams();
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const textareaRef = useRef(null);

  // On mount, check for ?data=... and decrypt
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!ENC_KEY) {
      setError("Encryption key is missing. Please set NEXT_PUBLIC_ENCRYPTION_KEY in your .env file.");
      return;
    }
    const data = searchParams.get("data");
    if (data) {
      try {
        const encrypted = decodeURIComponent(data);
        const bytes = CryptoJS.AES.decrypt(encrypted, ENC_KEY);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        setText(decrypted);
      } catch (e) {
        setError("Failed to decrypt paste. The link or key may be invalid.");
      }
    }
  }, []); // Only run on mount

  useEffect(() => {
    if (typeof window === "undefined" || !ENC_KEY) return;
    if (text.trim()) {
      try {
        const encrypted = CryptoJS.AES.encrypt(text, ENC_KEY).toString();
        const encoded = encodeURIComponent(encrypted);
        window.history.replaceState(null, "", `?data=${encoded}`);
        setError("");
      } catch (e) {
        setError("Encryption error. Check your key.");
      }
    } else {
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, [text]);

  return (
    <div style={{
      minHeight: '100vh',
      minWidth: '100vw',
      height: '100vh',
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#f7f7fa',
      padding: 0,
      margin: 0,
      boxSizing: 'border-box',
    }}>
      <div style={{
        background: '#fff',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        borderRadius: 0,
        padding: 32,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        flex: 1,
        boxSizing: 'border-box',
      }}>
        <h1 style={{ textAlign: 'center', fontSize: 32, fontWeight: 700, marginBottom: 8, letterSpacing: -1 }}>Dativerse.Pastebin</h1>
        <p style={{ textAlign: 'center', color: '#888', marginBottom: 24, fontSize: 16 }}>
          Paste your text or code below. The URL updates in real time for easy sharing.
        </p>
        {error && (
          <div style={{ color: 'red', textAlign: 'center', marginBottom: 16 }}>{error}</div>
        )}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <textarea
            ref={textareaRef}
            value={text}
            onChange={e => setText(e.target.value)}
            style={{
              flex: 1,
              minHeight: 0,
              width: '100%',
              height: '100%',
              fontSize: 17,
              padding: 16,
              borderRadius: 8,
              border: '1.5px solid #e0e0e0',
              outline: 'none',
              background: '#fafbfc',
              resize: 'vertical',
              fontFamily: 'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
              boxSizing: 'border-box',
              transition: 'border 0.2s',
              marginBottom: 0,
            }}
            placeholder="Paste your text or code here..."
            onFocus={e => e.currentTarget.style.border = '1.5px solid #a0a0ff'}
            onBlur={e => e.currentTarget.style.border = '1.5px solid #e0e0e0'}
            disabled={!!error}
          />
        </div>
      </div>
      <footer style={{ position: 'fixed', bottom: 8, left: 0, width: '100vw', color: '#bbb', fontSize: 14, textAlign: 'center', background: 'transparent', zIndex: 10 }}>
        Made with ♥ | <a href="https://github.com/yourusername" style={{ color: '#888', textDecoration: 'underline' }} target="_blank" rel="noopener noreferrer">GitHub</a>
      </footer>
    </div>
  );
}
