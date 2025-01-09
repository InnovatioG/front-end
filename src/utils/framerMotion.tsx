import { motion } from 'framer-motion';
import React from 'react';

interface FramerMotionAnimationProps {
    isVisible: boolean;
    children: React.ReactNode;
}

const FramerMotionAnimation: React.FC<FramerMotionAnimationProps> = ({ isVisible, children }) => {
    return (
        <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: isVisible ? 'auto' : 0, opacity: isVisible ? 1 : 0 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
        >
            {children}
        </motion.div>
    );
};

export default FramerMotionAnimation;
2;
