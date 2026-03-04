import { useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import SpeciesListPage from "./pages/SpeciesListPage";
import SpeciesDetailPage from "./pages/SpeciesDetailPage";
import AddSpeciesPage from "./pages/AddSpeciesPage";
import TablePage from "./pages/TablePage";
import DetectionPage from "./pages/DetectionPage";
import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState("home");

  const renderCurrentPage = () => {
    if (currentPage === "home") return <HomePage />;
    if (currentPage === "list") return <SpeciesListPage />;
    if (currentPage === "detail") return <SpeciesDetailPage />;
    if (currentPage === "add") return <AddSpeciesPage />;
    if (currentPage === "table") return <TablePage />;
    return <DetectionPage />;
  };

  return (
    <div className="app-layout">
      <Navbar currentPage={currentPage} onChangePage={setCurrentPage} />
      {renderCurrentPage()}
      <Footer />
    </div>
  );
}
export default App;
