import Image from "next/image";

export default function LeafShadowOverlay() {
    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
            {/* Top Left Leaf Shadow - Realistic Image */}
            <div
                className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] opacity-[0.4] mix-blend-multiply"
                style={{ filter: "blur(2px)" }}
            >
                <Image
                    src="/images/assets/leaf-shadow.png"
                    alt="Shadow Overlay"
                    fill
                    className="object-contain rotate-180"
                    priority
                />
            </div>

            {/* Bottom Right Leaf Shadow - Realistic Image */}
            <div
                className="absolute -bottom-[10%] -right-[10%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] opacity-[0.5] mix-blend-multiply"
                style={{ filter: "blur(4px)" }}
            >
                <Image
                    src="/images/assets/leaf-shadow.png"
                    alt="Shadow Overlay"
                    fill
                    className="object-contain"
                    priority
                />
            </div>

            {/* Vignette Overlay for Depth */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_50%,_rgba(42,59,46,0.03)_100%)]" />
        </div>
    );
}
