import { MotionConfig } from 'framer-motion';
import { AppProvider } from './context';
import { useTheme } from './hooks/useTheme';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { Ticker } from './components/Ticker';
import { About } from './components/About';
import { Experience } from './components/Experience';
import { Projects } from './components/Projects';
import { Skills } from './components/Skills';
import { Education } from './components/Education';
import { Leadership } from './components/Leadership';
import { Achievements } from './components/Achievements';
import { Beyond } from './components/Beyond';
import { Contact } from './components/Contact';
import { CommandPalette } from './components/CommandPalette';
import { Toast } from './components/Toast';

export default function App() {
  const { theme, toggle } = useTheme();
  return (
    <MotionConfig reducedMotion="user">
      <AppProvider>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Nav theme={theme} onToggleTheme={toggle} />
        <main id="main">
          <Hero />
          <Ticker />
          <About />
          <Experience />
          <Projects />
          <Skills />
          <Education />
          <Leadership />
          <Achievements />
          <Beyond />
          <Contact />
        </main>
        <CommandPalette onToggleTheme={toggle} />
        <Toast />
      </AppProvider>
    </MotionConfig>
  );
}
