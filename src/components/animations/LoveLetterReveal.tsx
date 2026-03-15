import { motion } from "framer-motion";

interface Props {
  message: string;
  delay: number;
}

const LoveLetterReveal = ({ message, delay }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotateX: 40 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ delay, duration: 0.8, type: "spring" }}
      className="w-full max-w-lg mx-auto my-8"
    >
      <div
        className="relative rounded-2xl p-8 sm:p-10"
        style={{
          background: "linear-gradient(145deg, hsl(340, 40%, 18%), hsl(340, 30%, 14%))",
          border: "1px solid hsl(340, 50%, 30%)",
          boxShadow: "0 20px 60px -15px hsl(340, 60%, 20%, 0.5), inset 0 1px 0 hsl(340, 60%, 35%, 0.2)",
        }}
      >
        {/* Decorative corner hearts */}
        <div className="absolute top-3 left-3 opacity-20">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="hsl(340, 82%, 65%)">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
        <div className="absolute bottom-3 right-3 opacity-20">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="hsl(340, 82%, 65%)">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.4, duration: 0.8 }}
          className="text-lg sm:text-xl leading-relaxed font-body text-center"
          style={{ color: "hsl(340, 30%, 80%)" }}
        >
          "{message}"
        </motion.p>
      </div>
    </motion.div>
  );
};

export default LoveLetterReveal;
