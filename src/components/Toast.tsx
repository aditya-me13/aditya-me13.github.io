import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useApp } from '../context';

export function Toast() {
  const { toast } = useApp();
  return (
    <div aria-live="polite">
      <AnimatePresence>
        {toast && (
          <motion.div className="toast" initial={{ opacity: 0, y: 20, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, y: 20, x: '-50%' }}>
            <Check size={16} /> {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
