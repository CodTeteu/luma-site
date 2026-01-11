export default function LeafShadowOverlay() {
    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
            {/* Top Left Leaf Shadow */}
            <div
                className="absolute -top-[10%] -left-[5%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] opacity-[0.08]"
                style={{ filter: "blur(8px)" }}
            >
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-forest">
                    <path fill="currentColor" d="M45.7,-76.3C58.9,-69.3,69.1,-57.6,76.6,-45.1C84.1,-32.6,88.9,-19.3,86.4,-6.8C84,5.7,74.3,17.4,65.6,28.2C56.9,39,49.2,48.9,39.6,56.7C29.9,64.5,18.3,70.2,5.8,71.5C-6.7,72.8,-20.1,69.8,-32.8,63.6C-45.5,57.4,-57.5,48,-66.9,36.2C-76.3,24.4,-83.1,10.2,-81.8,-3.4C-80.5,-17,-71.1,-30,-60.7,-40.8C-50.3,-51.6,-38.9,-60.2,-26.8,-67.7C-14.7,-75.2,-1.9,-81.6,11.3,-80.6C24.5,-79.6,47.7,-71.3,45.7,-76.3Z" transform="translate(100 100) scale(1.1)" />
                </svg>
            </div>

            {/* Bottom Right Leaf Shadow */}
            <div
                className="absolute top-[40%] -right-[10%] w-[50vw] h-[60vw] max-w-[600px] max-h-[800px] opacity-[0.12]"
                style={{ filter: "blur(12px)", transform: "rotate(180deg)" }}
            >
                <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-forest">
                    <g transform="translate(250,250)">
                        <path d="M0,-180 C40,-160 80,-120 100,-80 C130,-20 120,40 80,100 C40,140 -20,150 -80,120 C-140,90 -160,30 -140,-40 C-120,-100 -60,-160 0,-180" fill="currentColor" />
                        <path d="M20,-200 C60,-180 100,-140 120,-100 C150,-40 140,20 100,80 C60,120 0,130 -60,100 C-120,70 -140,10 -120,-60 C-100,-120 -40,-180 20,-200" fill="currentColor" transform="rotate(45)" opacity="0.8" />
                    </g>
                </svg>
            </div>

            {/* Extra botanical elements - subtle branches */}
            <div
                className="absolute bottom-0 left-0 w-[30%] h-[40%] opacity-[0.06]"
                style={{ filter: "blur(4px)" }}
            >
                <svg viewBox="0 0 100 100" className="w-full h-full text-forest">
                    <path d="M0,100 Q30,60 10,20" stroke="currentColor" strokeWidth="2" fill="none" />
                    <path d="M10,20 Q40,10 50,0" stroke="currentColor" strokeWidth="1" fill="none" />
                    <path d="M5,80 Q25,70 30,50" stroke="currentColor" strokeWidth="1" fill="none" />
                    <path d="M15,40 Q35,30 40,10" stroke="currentColor" strokeWidth="1" fill="none" />
                </svg>
            </div>
        </div>
    );
}
