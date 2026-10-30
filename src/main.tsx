import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AnimateUIProvider } from '@animate-ui/react/provider'
import { TooltipProvider } from '@/components/ui/tooltip'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* TooltipProvider: obbligatorio per InfoTip / Tooltip shadcn (delay, skip delay). */}
    <TooltipProvider delayDuration={200}>
      <AnimateUIProvider>
        <App />
      </AnimateUIProvider>
    </TooltipProvider>
  </StrictMode>,
)
