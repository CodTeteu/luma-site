import { motion } from 'framer-motion';
import { Gift, CreditCard, Heart, ArrowLeft, Check, Copy } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const giftOptions = [
    {
        icon: Heart,
        title: 'Lua de Mel - Jantar Romântico',
        description: 'Um jantar especial na nossa viagem pela Itália',
        price: 'R$ 300,00',
        link: '#'
    },
    {
        icon: Heart,
        title: 'Lua de Mel - Passeio de Gôndola',
        description: 'Passeio pelos canais de Veneza',
        price: 'R$ 450,00',
        link: '#'
    },
    {
        icon: Gift,
        title: 'Jogo de Jantar',
        description: 'Para nossos jantares em família',
        price: 'R$ 500,00',
        link: '#'
    },
    {
        icon: Gift,
        title: 'Cafeteira Expresso',
        description: 'Para começar o dia com energia',
        price: 'R$ 400,00',
        link: '#'
    },
    {
        icon: Gift,
        title: 'Kit Churrasco',
        description: 'Para os domingos de sol',
        price: 'R$ 250,00',
        link: '#'
    },
    {
        icon: CreditCard,
        title: 'Cota de Lua de Mel',
        description: 'Contribuição livre para nossa viagem',
        price: 'Valor livre',
        link: '#'
    }
];

const GiftsPage = () => {
    const [copied, setCopied] = useState(false);
    const pixKey = "ana.pedro@email.com";

    const handleCopy = () => {
        navigator.clipboard.writeText(pixKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    return (
        <div className="min-h-screen bg-cream selection:bg-olive-200 selection:text-olive-900">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md border-b border-olive-100 fixed w-full z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 text-olive-600 hover:text-olive-800 transition-colors uppercase tracking-widest text-xs font-medium">
                        <ArrowLeft size={16} />
                        Voltar ao Início
                    </Link>
                    <span className="font-script text-2xl text-stone-800">Lista de Presentes</span>
                </div>
            </header>

            <main className="pt-28 pb-20 px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Intro */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <h1 className="text-4xl md:text-5xl font-script text-stone-800 mb-4">Escolha um Presente</h1>
                        <p className="text-stone-500 font-light max-w-2xl mx-auto">
                            Ficamos muito felizes com qualquer forma de carinho! Abaixo listamos algumas sugestões
                            de presentes virtuais. O valor será revertido para nossa lua de mel e montagem da casa.
                        </p>
                    </motion.div>

                    {/* PIX Highlight */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="max-w-2xl mx-auto bg-white p-8 rounded-sm shadow-xl border border-olive-200 mb-16 text-center"
                    >
                        <div className="w-12 h-12 mx-auto bg-olive-50 rounded-full flex items-center justify-center mb-4">
                            <Gift className="text-olive-600" size={24} />
                        </div>
                        <h3 className="text-xl font-serif text-stone-800 mb-2">Opção Preferencial: PIX</h3>
                        <p className="text-stone-500 text-sm mb-6 font-light">
                            Caso prefira, você pode fazer um PIX direto para nós. É prático e nos ajuda muito!
                        </p>

                        <button
                            onClick={handleCopy}
                            className="w-full flex items-center justify-between bg-stone-50 p-4 rounded-sm border border-olive-100 hover:border-olive-300 hover:bg-olive-50/50 transition-all duration-300 group max-w-lg mx-auto"
                        >
                            <code className="text-stone-600 font-mono text-lg tracking-wider mx-auto">{pixKey}</code>
                            <div className={`p-2 rounded-full transition-colors absolute right-8 ${copied ? 'bg-olive-100 text-olive-600' : 'text-stone-400 group-hover:text-olive-500'}`}>
                                {copied ? <Check size={20} /> : <Copy size={20} />}
                            </div>
                        </button>
                        {copied && (
                            <p className="text-olive-600 text-xs mt-2 font-medium">✓ Chave copiada!</p>
                        )}
                    </motion.div>

                    {/* Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {giftOptions.map((gift, index) => {
                            const Icon = gift.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 * index + 0.3 }}
                                    className="bg-white p-6 rounded-sm shadow-md border border-stone-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center"
                                >
                                    <div className="w-12 h-12 bg-cream rounded-full flex items-center justify-center mb-4 text-olive-600">
                                        <Icon size={24} strokeWidth={1.5} />
                                    </div>
                                    <h3 className="font-serif text-lg text-stone-800 mb-2">{gift.title}</h3>
                                    <p className="text-sm text-stone-500 font-light mb-4 flex-grow">{gift.description}</p>
                                    <div className="text-lg font-medium text-olive-700 mb-4">{gift.price}</div>
                                    <button className="w-full py-3 border border-olive-500 text-olive-600 hover:bg-olive-600 hover:text-white transition-colors uppercase text-xs tracking-widest font-medium rounded-sm">
                                        Presentear
                                    </button>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default GiftsPage;
