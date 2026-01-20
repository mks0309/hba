
import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const VALUES = [
  "NATION FIRST",
  "CARE",
  "INNOVATION",
  "PASSION",
  "TRUST"
];

// We duplicate the array multiple times to create a long enough strip for the loop
// Creating a sufficiently large array to ensure it covers wide screens before repeating
const TICKER_CONTENT = Array(8).fill(VALUES).flat();

export const CoreValuesTicker: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-[#F37021] z-50 overflow-hidden py-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] border-t border-orange-400">
      <div className="flex select-none w-full">
        <motion.div
          className="flex items-center flex-nowrap min-w-max"
          // Animate from 0 to -50% of the total width. 
          // Since we construct the content to be doubled visually in the loop logic, 
          // moving 50% ensures the second half aligns perfectly with where the first half started.
          animate={{ x: "-50%" }}
          transition={{
            duration: 80,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          {/* Render the content twice to ensure seamless looping */}
          {[...TICKER_CONTENT, ...TICKER_CONTENT].map((value, index) => (
            <div key={index} className="flex items-center flex-shrink-0">
              <span className="text-white text-xs md:text-sm font-bold uppercase tracking-widest whitespace-nowrap px-8 drop-shadow-sm">
                {value}
              </span>
              <span className="text-orange-200 opacity-60">
                <Star className="w-2.5 h-2.5 fill-current" />
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
