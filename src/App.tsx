import { useState, useEffect, useRef } from 'react';
import CryptoJS from 'crypto-js';
import './App.css';

const ENC_KEY = import.meta.env.VITE_ENCRYPTION_KEY;

function App() {
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // On mount, check for ?data=... and decrypt
  useEffect(() => {
    if (!ENC_KEY) {
      setError('Encryption key is missing. Please set VITE_ENCRYPTION_KEY in your .env file.');
      return;
    }
    const params = new URLSearchParams(window.location.search);
    const data = params.get('data');
    if (data) {
      try {
        const encrypted = decodeURIComponent(data);
        const bytes = CryptoJS.AES.decrypt(encrypted, ENC_KEY);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        setText(decrypted);
      } catch (e) {
        setError('Failed to decrypt paste. The link or key may be invalid.');
      }
    }
  }, []);

  useEffect(() => {
    if (!ENC_KEY) return;
    if (text.trim()) {
      try {
        const encrypted = CryptoJS.AES.encrypt(text, ENC_KEY).toString();
        const encoded = encodeURIComponent(encrypted);
        window.history.replaceState(null, '', `?data=${encoded}`);
        setError('');
      } catch (e) {
        setError('Encryption error. Check your key.');
      }
    } else {
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, [text]);

  return (
    <div className="container">
      <div className="main-box">
        <h1 className="header">Dativerse.Pastebin</h1>
        <p className="description">
          Paste your text or code below. The URL updates in real time for easy sharing.
        </p>
        {error && (
          <div className="error">{error}</div>
        )}
        <div className="textarea-wrapper">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={e => setText(e.target.value)}
            className="paste-textarea"
            placeholder="Paste your text or code here..."
            disabled={!!error}
          />
        </div>
      </div>
      <footer className="footer">
        Made with ♥ | <a href="https://github.com/Dativerse" target="_blank" rel="noopener noreferrer">GitHub</a>
      </footer>
    </div>
  );
}

export default App;
