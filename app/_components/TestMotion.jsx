'use client';

import { motion } from 'framer-motion';

export default function TestMotion() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      style={{ padding: '20px', background: 'red' }}
    >
      Test Motion Component
    </motion.div>
  );
} 