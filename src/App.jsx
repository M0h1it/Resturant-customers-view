import { Routes, Route } from "react-router-dom";
import ScreenSaver from "./pages/ScreenSaver";
import Menu from "./pages/Menu";

export default function App() {
  return (
      <Routes>
      {/* Default Landing Page */}
      <Route path="/" element={<ScreenSaver />} />

      {/* Screen Saver Accessible Anytime */}
      <Route path="/screensaver" element={<ScreenSaver />} />

      {/* Menu Page */}
      <Route path="/menu" element={<Menu />} />

      {/* Fallback Route */}
      <Route path="*" element={<ScreenSaver />} />
    </Routes>
  );
}
