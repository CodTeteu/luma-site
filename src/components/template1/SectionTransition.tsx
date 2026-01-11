import { motion } from 'framer-motion';

interface SectionTransitionProps {
    variant?: 'wave' | 'curve' | 'diagonal' | 'leaves';
    fromColor?: string;
    toColor?: string;
    flip?: boolean;
}

const SectionTransition = ({
    variant = 'curve',
    fromColor = '#FDFBF7',
    toColor = '#F7f8f4',
    flip = false
}: SectionTransitionProps) => {
    const renderPath = () => {
        switch (variant) {
            case 'wave':
                return (
                    <path
                        d="M0,96L48,106.7C96,117,192,139,288,138.7C384,139,480,117,576,122.7C672,128,768,160,864,165.3C960,171,1056,149,1152,133.3C1248,117,1344,107,1392,101.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                        fill={toColor}
                    />
                );
            case 'curve':
                return (
                    <path
                        d="M0,160L80,170.7C160,181,320,203,480,192C640,181,800,139,960,128C1120,117,1280,139,1360,149.3L1440,160L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
                        fill={toColor}
                    />
                );
            case 'diagonal':
                return (
                    <polygon points="0,100 1440,0 1440,320 0,320" fill={toColor} />
                );
            case 'leaves':
                return (
                    <>
                        <ellipse cx="200" cy="280" rx="250" ry="100" fill={toColor} opacity="0.5" />
                        <ellipse cx="700" cy="300" rx="300" ry="80" fill={toColor} opacity="0.7" />
                        <ellipse cx="1200" cy="270" rx="280" ry="90" fill={toColor} opacity="0.6" />
                        <rect x="0" y="280" width="1440" height="40" fill={toColor} />
                    </>
                );
            default:
                return (
                    <path
                        d="M0,160L1440,96L1440,320L0,320Z"
                        fill={toColor}
                    />
                );
        }
    };

    return (
        <div className={`relative w-full overflow-hidden ${flip ? 'rotate-180' : ''}`} style={{ backgroundColor: fromColor }}>
            <motion.svg
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                viewBox="0 0 1440 320"
                preserveAspectRatio="none"
                className="w-full h-16 md:h-24 block"
            >
                {renderPath()}
            </motion.svg>
        </div>
    );
};

export default SectionTransition;
