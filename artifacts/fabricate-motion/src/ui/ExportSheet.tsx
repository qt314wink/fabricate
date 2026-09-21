import type { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { motionMs } from "../engine/tokens";

/** Chrome only. Framer owns y; mesh solver must not write this node. */
export function ExportSheet({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fm-sheet"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: motionMs.medium / 1000, ease: [0.2, 0.8, 0.2, 1] }}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.12}
          onDragEnd={(_, info) => {
            if (info.velocity.y > 400 || info.offset.y > 120) onClose();
          }}
        >
          <div className="fm-sheet-handle" />
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
