import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomeLayout from "./layouts/HomeLayout";
import GameLayout from "./layouts/GameLayout";
import Home from "./pages/Home";
import Blanco from "./pages/Blanco";
import Wavelength from "./pages/Wavelength";
import Vergiftet from "./pages/Vergiftet";
import QuePrefieres from "./pages/QuePrefieres";
import RequireTempName from "./components/RequireTempName"; // ⬅️ guard
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<HomeLayout />}>
          <Route path="/" element={<Home />} />
        </Route>

        <Route element={<GameLayout />}>
          <Route path="/blanco" element={<Blanco />} />
          <Route path="/wavelength" element={<Wavelength />} />
          <Route path="/vergiftet" element={<Vergiftet />} />
          <Route
            path="/queprefieres"
            element={
              <RequireTempName>
                <QuePrefieres />
              </RequireTempName>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
