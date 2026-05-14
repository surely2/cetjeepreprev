import { useState, useEffect, useRef } from "react";

export function useMathReady() {
  const [ready, setReady] = useState(typeof window !== "undefined" && !!window.katex);

  useEffect(() => {
    if (window.katex) { setReady(true); return; }
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.css";
    document.head.appendChild(link);
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.js";
    script.onload = () => setReady(true);
    document.head.appendChild(script);
  }, []);

  return ready;
}

export function Math({ tex, display = false }) {
  const ref = useRef(null);
  const mathReady = useMathReady();

  useEffect(() => {
    if (!mathReady || !ref.current || !window.katex) return;
    try {
      window.katex.render(tex, ref.current, {
        displayMode: display,
        throwOnError: false,
        trust: true,
        strict: false,
      });
    } catch (e) { ref.current.textContent = tex; }
  }, [tex, display, mathReady]);

  return <span ref={ref} className={display ? "block my-2" : "inline"} />;
}
