import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import SpeciesListPage from './pages/SpeciesListPage'
import SpeciesDetailPage from './pages/SpeciesDetailPage'
import AddSpeciesPage from './pages/AddSpeciesPage'
import TablePage from './pages/TablePage'
import DetectionPage from './pages/DetectionPage'
import './App.css'

function App() {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/species" element={<SpeciesListPage />} />
          <Route path="/species/:id" element={<SpeciesDetailPage />} />
          <Route path="/add" element={<AddSpeciesPage />} />
          <Route path="/table" element={<TablePage />} />
          <Route path="/detect" element={<DetectionPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
