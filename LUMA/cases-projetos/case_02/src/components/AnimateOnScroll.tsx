import { useRef, useEffect, type ReactNode } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';

interface AnimateOnScrollProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    direction?: 'up' | 'down' | 'left' | 'right' | 'none';
}

export const AnimateOnScroll = ({
    children,
    className = '',
    delay = 0,
    direction = 'up'
}: AnimateOnScrollProps) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });
    const controls = useAnimation();

    const getInitialPosition = () => {
        switch (direction) {
            case 'up': return { opacity: 0, y: 40 };
            case 'down': return { opacity: 0, y: -40 };
            case 'left': return { opacity: 0, x: 40 };
            case 'right': return { opacity: 0, x: -40 };
            case 'none': return { opacity: 0 };
            default: return { opacity: 0, y: 40 };
        }
    };

    const getFinalPosition = () => {
        switch (direction) {
            case 'up':
            case 'down': return { opacity: 1, y: 0 };
            case 'left':
            case 'right': return { opacity: 1, x: 0 };
            case 'none': return { opacity: 1 };
            default: return { opacity: 1, y: 0 };
        }
    };

    useEffect(() => {
        if (isInView) {
            controls.start(getFinalPosition());
        }
    }, [isInView, controls]);

    return (
        <motion.div
            ref={ref}
            initial={getInitialPosition()}
            animate={controls}
            transition={{ duration: 0.6, delay, ease: 'easeOut' }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

export const staggerItem = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};
