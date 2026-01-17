import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ChevronRight, ChevronLeft, Music, Check, MessageSquare } from 'lucide-react';
import confetti from 'canvas-confetti';

import { logger } from '@/services/logger';
import { addRSVP } from '@/services/mockStorage';

interface FormData {
    name: string;
    phone: string;
    guests: string;
    guestNames: string;
    children: string;
    childrenAges: string;
    isAttending: string;
    songRequest: string;
    message: string;
}

const RSVP = () => {
    const [step, setStep] = useState(1);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        name: '',
        phone: '',
        guests: '1',
        guestNames: '',
        children: 'nao',
        childrenAges: '',
        isAttending: 'sim',
        songRequest: '',
        message: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        logger.formSubmission('RSVP', formData);

        // Save to localStorage via mockStorage
        addRSVP({
            name: formData.name,
            phone: formData.phone,
            guests: parseInt(formData.guests),
            guestNames: formData.guestNames,
            children: formData.children,
            childrenAges: formData.childrenAges,
            isAttending: formData.isAttending === 'sim',
            songRequest: formData.songRequest,
            message: formData.message,
        });

        // Dispatch event for cross-tab updates
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('luma-storage-update', { detail: { type: 'guests' } }));
        }

        setSubmitted(true);

        // Fire confetti celebration!
        if (formData.isAttending === 'sim') {
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#5c6b5d', '#C19B58', '#2A3B2E', '#F7F5F0']
            });
        }
    };

    const nextStep = () => setStep((s) => Math.min(s + 1, 3));
    const prevStep = () => setStep((s) => Math.max(s - 1, 1));

    const stepTitles = ['Seus Dados', 'Acompanhantes', 'Preferências'];

    if (submitted) {
        return (
            <section id="rsvp" className="section-padding bg-olive-50 relative overflow-hidden">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-2xl mx-auto bg-white p-12 md:p-16 shadow-2xl text-center relative"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: 'spring' }}
                        className="w-20 h-20 bg-olive-500 rounded-full flex items-center justify-center mx-auto mb-8"
                    >
                        <Check size={40} className="text-white" />
                    </motion.div>
                    <h2 className="text-4xl font-serif text-stone-800 mb-4">Obrigado, {formData.name}!</h2>
                    <p className="text-stone-600 font-light text-lg mb-6">
                        Sua confirmação foi recebida com sucesso.
                    </p>
                </motion.div>
            </section>
        );
    }

    return (
        <section id="rsvp" className="section-padding bg-olive-50 relative overflow-hidden">
            <div className="relative z-10">
                <div className="text-center mb-10">
                    <span className="text-olive-500 tracking-[0.2em] text-sm uppercase font-medium">RSVP</span>
                    <h2 className="text-5xl md:text-6xl text-stone-800 font-script mt-4">Confirme sua Presença</h2>
                </div>

                {/* Progress Bar */}
                <div className="max-w-xl mx-auto mb-12 px-4">
                    <div className="h-1 bg-stone-200 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-olive-500"
                            initial={{ width: '0%' }}
                            animate={{ width: `${(step / 3) * 100}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-stone-400 uppercase tracking-wider font-medium">
                        <span>Dados</span>
                        <span>Convidados</span>
                        <span>Final</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-4">
                    <div className="bg-white/90 backdrop-blur-sm p-8 md:p-12 shadow-2xl border border-white min-h-[400px] relative">
                        <h3 className="text-2xl font-serif text-stone-800 mb-8 text-center border-b border-stone-100 pb-4">
                            {stepTitles[step - 1]}
                        </h3>

                        <AnimatePresence mode="wait">
                            {/* Step 1: Personal Info */}
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest text-olive-600 mb-2">Nome Completo *</label>
                                        <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full input-field" placeholder="Seu nome" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest text-olive-600 mb-2">Telefone *</label>
                                        <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className="w-full input-field" placeholder="(00) 00000-0000" />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest text-olive-600 mb-4">Irá comparecer? *</label>
                                        <div className="flex gap-6">
                                            {['sim', 'nao'].map((val) => (
                                                <label key={val} className="flex items-center cursor-pointer group">
                                                    <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${formData.isAttending === val ? 'border-olive-500 bg-olive-500' : 'border-stone-300'}`}>
                                                        {formData.isAttending === val && <div className="w-2 h-2 bg-white rounded-full" />}
                                                    </div>
                                                    <span className="ml-2 text-stone-600">{val === 'sim' ? 'Sim, confirmo!' : 'Não poderei ir'}</span>
                                                    <input type="radio" name="isAttending" value={val} checked={formData.isAttending === val} onChange={handleChange} className="hidden" />
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 2: Guests & Children */}
                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-widest text-olive-600 mb-2">Adultos (Total)</label>
                                            <select name="guests" value={formData.guests} onChange={handleChange} className="w-full input-field">
                                                {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-widest text-olive-600 mb-2">Levará Crianças?</label>
                                            <select name="children" value={formData.children} onChange={handleChange} className="w-full input-field">
                                                <option value="nao">Não</option>
                                                <option value="sim">Sim</option>
                                            </select>
                                        </div>
                                    </div>

                                    {formData.children === 'sim' && (
                                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}>
                                            <label className="block text-xs font-bold uppercase tracking-widest text-olive-600 mb-2">Idade das Crianças</label>
                                            <input type="text" name="childrenAges" value={formData.childrenAges} onChange={handleChange} className="w-full input-field" placeholder="Ex: 2 anos, 5 anos" />
                                        </motion.div>
                                    )}

                                    {parseInt(formData.guests) > 1 && (
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-widest text-olive-600 mb-2">Nome dos Acompanhantes</label>
                                            <textarea name="guestNames" value={formData.guestNames} onChange={handleChange} rows={3} className="w-full input-field resize-none" placeholder="Um nome por linha..." />
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {/* Step 3: Final Details */}
                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <Music size={18} className="text-olive-600" />
                                            <label className="text-xs font-bold uppercase tracking-widest text-olive-600">Música que não pode faltar</label>
                                        </div>
                                        <input type="text" name="songRequest" value={formData.songRequest} onChange={handleChange} className="w-full input-field" placeholder="Ex: Evidências..." />
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <MessageSquare size={18} className="text-olive-600" />
                                            <label className="text-xs font-bold uppercase tracking-widest text-olive-600">Mensagem aos Noivos</label>
                                        </div>
                                        <textarea name="message" value={formData.message} onChange={handleChange} rows={4} className="w-full input-field resize-none" placeholder="Deixe seu recado..." />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Nav Buttons */}
                        <div className="flex justify-between mt-8 pt-6 border-t border-stone-100 items-center">
                            {step > 1 ? (
                                <button type="button" onClick={prevStep} className="text-stone-500 hover:text-stone-800 flex items-center gap-1 text-sm font-medium">
                                    <ChevronLeft size={16} /> Voltar
                                </button>
                            ) : <div></div>}

                            {step < 3 ? (
                                <button type="button" onClick={nextStep} className="bg-olive-600 text-white px-6 py-3 rounded-sm uppercase text-xs tracking-widest hover:bg-olive-700 transition-colors flex items-center gap-2">
                                    Próximo <ChevronRight size={16} />
                                </button>
                            ) : (
                                <button type="submit" className="bg-olive-600 text-white px-8 py-3 rounded-sm uppercase text-xs tracking-widest hover:bg-olive-700 transition-colors shadow-lg flex items-center gap-2">
                                    <Send size={16} /> Confirmar
                                </button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default RSVP;

