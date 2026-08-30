import About from './components/About'
import Atelier from './components/Atelier'
import BeforeAfter from './components/BeforeAfter'
import Catalog from './components/Catalog'
import Collections from './components/Collections'
import Differentials from './components/Differentials'
import Faq from './components/Faq'
import Footer from './components/Footer'
import Header from './components/Header'
import Hero from './components/Hero'
import Library from './components/Library'
import TopBar from './components/TopBar'
import WhatsAppFab from './components/WhatsAppFab'

export default function App() {
  return (
    <>
      <TopBar />
      <Header />
      <main>
        <Hero />
        <Collections />
        <Differentials />
        <Catalog />
        <Library />
        <BeforeAfter />
        <Atelier />
        <About />
        <Faq />
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  )
}
