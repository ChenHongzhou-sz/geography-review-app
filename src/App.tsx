import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useStudyEngine } from "./hooks/useStudyEngine";
import { HomePage } from "./pages/HomePage";
import { MapPage } from "./pages/MapPage";
import { MistakesPage } from "./pages/MistakesPage";
import { ReviewPage } from "./pages/ReviewPage";
import { SprintPage } from "./pages/SprintPage";
import { TrainingPage } from "./pages/TrainingPage";
import { UnitDetailPage } from "./pages/UnitDetailPage";
import { UnitsPage } from "./pages/UnitsPage";

function RoutedApp() {
  const engine = useStudyEngine();

  return (
    <Routes>
      <Route path="/" element={<HomePage engine={engine} />} />
      <Route path="/units" element={<UnitsPage engine={engine} />} />
      <Route path="/unit/:unitId" element={<UnitDetailPage engine={engine} />} />
      <Route path="/training/:unitId" element={<TrainingPage engine={engine} />} />
      <Route path="/maps/:unitId" element={<MapPage engine={engine} />} />
      <Route path="/mistakes" element={<MistakesPage engine={engine} />} />
      <Route path="/review" element={<ReviewPage engine={engine} />} />
      <Route path="/sprint" element={<SprintPage engine={engine} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function getRouterBase() {
  const base = import.meta.env.BASE_URL;

  if (base === "/") {
    return "/";
  }

  return base.endsWith("/") ? base.slice(0, -1) : base;
}

export default function App() {
  return (
    <BrowserRouter basename={getRouterBase()}>
      <RoutedApp />
    </BrowserRouter>
  );
}
