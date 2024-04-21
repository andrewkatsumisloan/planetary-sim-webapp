import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./pages/LandingPage";
import "./App.css";
import LandingPage from "./pages/LandingPage";
import Scene from "./pages/Scene";

function App() {
  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <Scene />
    </div>
  );
}

export default App;
