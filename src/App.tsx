import { NavLink, Route, Routes } from "react-router-dom";
import { LevelProvider, useLevel } from "./level";
import Home from "./pages/Home";
import Compare from "./pages/Compare";
import ModelsPage from "./pages/ModelsPage";
import Advisor from "./pages/Advisor";
import Learn from "./pages/Learn";

function LevelToggle() {
  const { level, setLevel } = useLevel();
  return (
    <div className="level-toggle" title="Adjusts how much jargon and detail is shown">
      <button className={level === "beginner" ? "on" : ""} onClick={() => setLevel("beginner")}>
        Beginner
      </button>
      <button className={level === "expert" ? "on" : ""} onClick={() => setLevel("expert")}>
        Expert
      </button>
    </div>
  );
}

function Nav() {
  const link = (to: string, label: string) => (
    <NavLink to={to} className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} end={to === "/"}>
      {label}
    </NavLink>
  );
  return (
    <nav className="nav">
      <div className="nav-inner">
        <span className="logo">Compare<span>AI</span></span>
        <div className="nav-links">
          {link("/", "Home")}
          {link("/compare", "Compare")}
          {link("/models", "Models")}
          {link("/advisor", "Advisor")}
          {link("/learn", "Learn")}
        </div>
        <LevelToggle />
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <LevelProvider>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/models" element={<ModelsPage />} />
        <Route path="/advisor" element={<Advisor />} />
        <Route path="/learn" element={<Learn />} />
      </Routes>
      <footer className="footer">
        <div className="container">
          CompareAI — the AI model comparison database. Data snapshot: July 2026. Prices and specs
          change frequently; always verify with the provider before committing to a plan.
        </div>
      </footer>
    </LevelProvider>
  );
}
