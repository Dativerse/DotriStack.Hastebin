import { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const data = params.get("data");
    if (data) {
      const decoded = decodeURIComponent(data);
      setText(decoded);
    }
  }, []);

  useEffect(() => {
    if (text.trim()) {
      const encoded = encodeURIComponent(text);
      window.history.replaceState(null, "", `?data=${encoded}`);
    } else {
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, [text]);

  return (
    <div className="container">
      <div className="main-box">
        <h1 className="header">Dativerse.Pastebin</h1>
        <p className="description">
          Paste your text or code below. The URL updates in real time for easy
          sharing.
        </p>
        <div className="textarea-wrapper">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="paste-textarea"
            placeholder="Paste your text or code here..."
          />
        </div>
      </div>
      <footer className="footer">
        Made with ♥ |{" "}
        <a
          href="https://github.com/Dativerse"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
      </footer>
    </div>
  );
}

export default App;
