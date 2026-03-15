import { motion } from "framer-motion";

interface Props {
  delay: number;
}

const HeartDivider = ({ delay }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0 }}
      animate={{ opacity: 1, scaleX: 1 }}
      transition={{ delay, duration: 0.6 }}
      className="flex items-center gap-3 my-6 w-full max-w-xs mx-auto"
    >
      <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, transparent, hsl(340, 60%, 40%))" }} />
      <svg width="14" height="14" viewBox="0 0 24 24" fill="hsl(340, 70%, 55%)" className="shrink-0">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
      <div className="flex-1 h-px" style={{ background: "linear-gradient(to left, transparent, hsl(340, 60%, 40%))" }} />
    </motion.div>
  );
};

export default HeartDivider;
