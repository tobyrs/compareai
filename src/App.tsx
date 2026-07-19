import { Link, NavLink, Route, Routes } from "react-router-dom";
import { DATA_UPDATED } from "./data/models";
import { LevelProvider, useLevel } from "./level";
import Home from "./pages/Home";
import Compare from "./pages/Compare";
import ModelsPage from "./pages/ModelsPage";
import ModelDetail from "./pages/ModelDetail";
import Calculator from "./pages/Calculator";
import Advisor from "./pages/Advisor";
import Learn from "./pages/Learn";
import About from "./pages/About";

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
          {link("/calculator", "Calculator")}
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
        <Route path="/model/:id" element={<ModelDetail />} />
        <Route path="/calculator" element={<Calculator />} />
        <Route path="/advisor" element={<Advisor />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/about" element={<About />} />
      </Routes>
      <footer className="footer">
        <div className="container">
          CompareAI — the AI model comparison database. Prices &amp; context windows auto-refresh
          daily from public APIs (last update: {DATA_UPDATED}). Qualitative notes are a July 2026
          editorial snapshot. Always verify with the provider before committing to a plan.
          {" "}<Link to="/about">About the data</Link>
        </div>
      </footer>
    </LevelProvider>
  );
}
