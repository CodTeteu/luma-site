const SectionDivider = () => {
    return (
        <div className="relative py-8 overflow-hidden">
            {/* Main decorative line */}
            <div className="flex items-center justify-center gap-4">
                <div className="h-px w-24 bg-gradient-to-r from-transparent to-olive-200" />

                {/* Center ornament */}
                <svg
                    viewBox="0 0 60 20"
                    className="w-16 h-5 text-olive-300"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                >
                    {/* Left leaf */}
                    <path d="M0 10 Q15 5, 25 10" />
                    <path d="M0 10 Q15 15, 25 10" />

                    {/* Right leaf (mirrored) */}
                    <path d="M60 10 Q45 5, 35 10" />
                    <path d="M60 10 Q45 15, 35 10" />

                    {/* Center dot */}
                    <circle cx="30" cy="10" r="2" fill="currentColor" />
                </svg>

                <div className="h-px w-24 bg-gradient-to-l from-transparent to-olive-200" />
            </div>
        </div>
    );
};

export default SectionDivider;
