import { HashRouter, Route, Routes, useLocation } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { ReviewPage } from "./pages/ReviewPage";
import { MapPage } from "./pages/MapPage";
import { MistakesPage } from "./pages/MistakesPage";
import { SprintPage } from "./pages/SprintPage";
import { useStudyEngine } from "./hooks/useStudyEngine";

function RoutedApp() {
  const engine = useStudyEngine();
  const location = useLocation();

  return (
    <Routes location={location}>
      <Route path="/" element={<HomePage engine={engine} />} />
      <Route path="/review" element={<ReviewPage engine={engine} />} />
      <Route path="/map" element={<MapPage engine={engine} />} />
      <Route path="/mistakes" element={<MistakesPage engine={engine} />} />
      <Route path="/sprint" element={<SprintPage engine={engine} />} />
    </Routes>
  );
}

export default function App() {
  return (
    <HashRouter>
      <RoutedApp />
    </HashRouter>
  );
}
