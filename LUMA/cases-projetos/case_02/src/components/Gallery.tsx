import { motion } from 'framer-motion';
import { useRef } from 'react';
import { Camera } from 'lucide-react';

const photos = [
    {
        src: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        caption: "O Sim",
        rotation: -5,
        x: -10,
        y: -20
    },
    {
        src: "https://images.unsplash.com/photo-1511285560982-1351cdeb9821?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        caption: "Nós",
        rotation: 8,
        x: 20,
        y: 10
    },
    {
        src: "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        caption: "Para Sempre",
        rotation: -12,
        x: -30,
        y: 30
    },
    {
        src: "https://images.unsplash.com/photo-1522673607200-1645062cd958?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        caption: "Momentos",
        rotation: 6,
        x: 40,
        y: -10
    },
    {
        src: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        caption: "Amor",
        rotation: -3,
        x: 0,
        y: 0
    }
];

const Gallery = () => {
    const constraintsRef = useRef(null);

    return (
        <section id="gallery" className="relative py-24 bg-olive-50 overflow-hidden min-h-[800px] flex flex-col items-center">
            <div className="text-center mb-12 relative z-10 pointer-events-none">
                <span className="text-olive-500 tracking-[0.2em] text-sm uppercase font-medium">Nossas Memórias</span>
                <h2 className="text-5xl md:text-6xl text-stone-800 font-script mt-2">Mesa de Fotos</h2>
                <p className="text-stone-500 font-serif italic mt-4 flex items-center justify-center gap-2">
                    <Camera size={16} />
                    Arraste as fotos para reviver os momentos
                </p>
            </div>

            {/* Draggable Area */}
            <div ref={constraintsRef} className="absolute inset-0 w-full h-full max-w-7xl mx-auto mt-32">
                {photos.map((photo, index) => (
                    <motion.div
                        key={index}
                        drag
                        dragConstraints={constraintsRef}
                        dragElastic={0.2}
                        whileHover={{ scale: 1.1, zIndex: 50, cursor: 'grab' }}
                        whileDrag={{ scale: 1.2, zIndex: 100, cursor: 'grabbing', rotate: 0 }}
                        initial={{
                            opacity: 0,
                            x: 0,
                            y: 100,
                            rotate: 0
                        }}
                        whileInView={{
                            opacity: 1,
                            x: `${photo.x}%`,
                            y: photo.y,
                            rotate: photo.rotation
                        }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                        className="absolute left-[35%] md:left-[42%] top-1/4 p-4 bg-white shadow-xl hover:shadow-2xl transition-shadow w-64 md:w-80 transform-gpu"
                        style={{
                            boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.3)'
                        }}
                    >
                        {/* Tape effect */}
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-32 h-8 bg-white/40 backdrop-blur-sm rotate-2 shadow-sm border border-white/20 z-10"></div>

                        <div className="aspect-[4/5] bg-stone-100 mb-4 overflow-hidden grayscale-[20%] hover:grayscale-0 transition-all duration-500">
                            <img
                                src={photo.src}
                                alt={photo.caption}
                                className="w-full h-full object-cover pointer-events-none"
                            />
                        </div>
                        <div className="text-center">
                            <p className="font-script text-3xl text-stone-800 rotate-1">{photo.caption}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Background Texture */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-10 pointer-events-none mix-blend-multiply"></div>
        </section>
    );
};

export default Gallery;
