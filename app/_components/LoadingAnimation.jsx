'use client';

import { motion } from 'framer-motion';

const loadingContainerVariants = {
  start: {
    transition: {
      staggerChildren: 0.2
    }
  },
  end: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

const loadingCircleVariants = {
  start: {
    y: "0%"
  },
  end: {
    y: "100%"
  }
};

const loadingCircleTransition = {
  duration: 0.5,
  yoyo: Infinity,
  ease: "easeInOut"
};

export default function LoadingAnimation({ size = 'md' }) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div className="flex justify-center items-center">
      <motion.div
        className={`flex space-x-1 ${sizeClasses[size]}`}
        variants={loadingContainerVariants}
        initial="start"
        animate="end"
      >
        <motion.span
          className="block bg-primary rounded-full"
          style={{ width: '4px', height: '4px' }}
          variants={loadingCircleVariants}
          transition={loadingCircleTransition}
        />
        <motion.span
          className="block bg-primary rounded-full"
          style={{ width: '4px', height: '4px' }}
          variants={loadingCircleVariants}
          transition={loadingCircleTransition}
        />
        <motion.span
          className="block bg-primary rounded-full"
          style={{ width: '4px', height: '4px' }}
          variants={loadingCircleVariants}
          transition={loadingCircleTransition}
        />
      </motion.div>
    </div>
  );
}

export function PulseLoading() {
  return (
    <div className="flex justify-center items-center">
      <motion.div
        className="w-8 h-8 bg-primary rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [1, 0.5, 1]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
}

export function SpinnerLoading() {
  return (
    <div className="flex justify-center items-center">
      <motion.div
        className="w-8 h-8 border-4 border-gray-200 border-t-primary rounded-full"
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  );
} 