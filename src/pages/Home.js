import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  return (
    <section className="home-container">
      <div className="home-buttons">
        <Link to="/blanco" className="home-btn">Blanco</Link>
        <Link to="/wavelength" className="home-btn">Wavelength</Link>
        <Link to="/vergiftet" className="home-btn">Vergiftet</Link>
        <Link to="/queprefieres" className="home-btn">¿Qué prefieres?</Link>
        <Link to="/wordle" className="home-btn">Wordle</Link>
      </div>
    </section>
  );
}
