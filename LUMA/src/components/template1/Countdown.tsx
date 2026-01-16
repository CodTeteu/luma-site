import { useState, useEffect } from 'react';

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

const Countdown = () => {
    const weddingDate = new Date('2025-10-25T16:30:00');

    const calculateTimeLeft = (): TimeLeft => {
        const difference = weddingDate.getTime() - new Date().getTime();

        if (difference <= 0) {
            return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }

        return {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
        };
    };

    const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const timeUnits = [
        { value: timeLeft.days, label: 'Dias' },
        { value: timeLeft.hours, label: 'Horas' },
        { value: timeLeft.minutes, label: 'Minutos' },
        { value: timeLeft.seconds, label: 'Segundos' },
    ];

    return (
        <div className="flex justify-center gap-4 md:gap-8">
            {timeUnits.map((unit, index) => (
                <div key={index} className="text-center group">
                    <div className="relative">
                        {/* Glass card background */}
                        <div className="w-16 h-20 md:w-24 md:h-28 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 flex items-center justify-center shadow-xl group-hover:bg-white/20 transition-all duration-300">
                            <span className="text-3xl md:text-5xl font-serif text-white font-light tabular-nums">
                                {String(unit.value).padStart(2, '0')}
                            </span>
                        </div>
                        {/* Decorative line */}
                        <div className="absolute left-0 right-0 top-1/2 h-px bg-white/10"></div>
                    </div>
                    <span className="text-xs md:text-sm text-white/70 uppercase tracking-[0.2em] mt-3 block font-light">
                        {unit.label}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default Countdown;
