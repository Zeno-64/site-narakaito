import { Route, Routes } from 'react-router-dom'
import Footer from './components/Footer'
import Header from './components/Header'
import TopBar from './components/TopBar'
import Contatos from './components/Contatos'
import Home from './pages/Home'
import Produto from './pages/Produto'

export default function App() {
  return (
    <>
      <TopBar />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/peca/:slug" element={<Produto />} />
        <Route path="*" element={<Produto />} />
      </Routes>
      <Footer />
      <Contatos />
    </>
  )
}
