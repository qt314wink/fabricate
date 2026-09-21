import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { BracketApp } from "./apps/bracket/BracketApp";
import { LampApp } from "./apps/lamp/LampApp";
import { RingApp } from "./apps/ring/RingApp";
import "./styles.css";

function Root() {
  const [app, setApp] = useState<"bracket" | "lamp" | "ring">("bracket");
  return (
    <>
      <nav className="fm-nav">
        <button data-on={app === "bracket"} onClick={() => setApp("bracket")}>
          Bracket cell
        </button>
        <button data-on={app === "lamp"} onClick={() => setApp("lamp")}>
          Lamp storefront
        </button>
        <button data-on={app === "ring"} onClick={() => setApp("ring")}>
          Ring shank
        </button>
      </nav>
      {app === "bracket" ? <BracketApp /> : app === "lamp" ? <LampApp /> : <RingApp />}
    </>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
