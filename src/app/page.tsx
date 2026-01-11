"use client";

import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import {
  Palette,
  MessageCircle,
  Smartphone,
  MapPin,
  Sparkles,
  Zap,
  Handshake,
  Instagram,
  Mail,
  Phone,
  Star,
  Heart,
  Diamond,
  Crown,
  Gem,
  ChevronDown,
  Check,
  ArrowRight,
  Play,
  Quote,
  Users,
  Award,
  Clock,
  Shield,
  Gift,
  Camera,
} from "lucide-react";

// ==========================================
// FLOATING PARTICLES COMPONENT
// ==========================================
function FloatingParticles() {
  const [particles, setParticles] = useState<Array<{
    id: number;
    opacity: number;
    left: number;
    top: number;
    xOffset: number;
    scale: number;
    duration: number;
    delay: number;
  }>>([]);

  useEffect(() => {
    // Generate particles only on client-side to avoid hydration mismatch
    const generatedParticles = [...Array(20)].map((_, i) => ({
      id: i,
      opacity: 0.1 + Math.random() * 0.3,
      left: Math.random() * 100,
      top: Math.random() * 100,
      xOffset: Math.random() * 50 - 25,
      scale: 1 + Math.random(),
      duration: 8 + Math.random() * 10,
      delay: Math.random() * 5,
    }));
    setParticles(generatedParticles);
  }, []);

  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 rounded-full"
          style={{
            background: `rgba(201, 169, 98, ${particle.opacity})`,
            left: `${particle.left}%`,
            top: `${particle.top}%`,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, particle.xOffset, 0],
            opacity: [0, 1, 0],
            scale: [0, particle.scale, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// ==========================================
// ANIMATED BACKGROUND GRADIENT
// ==========================================
function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#fdfcfa]">
      {/* Custom Brand Background */}
      <div
        className="absolute inset-0 opacity-40 mix-blend-multiply"
        style={{
          backgroundImage: 'url(/background-luma.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Animated gradient orbs */}
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full opacity-[0.03]"
        style={{
          background: "radial-gradient(circle, #c9a962 0%, transparent 70%)",
          top: "-20%",
          right: "-10%",
        }}
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full opacity-[0.02]"
        style={{
          background: "radial-gradient(circle, #c67d5e 0%, transparent 70%)",
          bottom: "-10%",
          left: "-5%",
        }}
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -30, 0],
          y: [0, -50, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(201, 169, 98, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201, 169, 98, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
        }}
      />
    </div>
  );
}

// ==========================================
// REUSABLE TEXTURE BACKGROUND
// ==========================================
function TextureBackground({ opacity = 0.3, className = "" }: { opacity?: number, className?: string }) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none mix-blend-multiply ${className}`}
      style={{
        opacity,
        backgroundImage: 'url(/background-luma.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    />
  );
}

// ==========================================
// LUXURY DIVIDER
// ==========================================
function LuxuryDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-4 ${className}`}>
      <motion.div
        className="h-px w-16 bg-gradient-to-r from-transparent to-[var(--gold)]"
        initial={{ width: 0 }}
        whileInView={{ width: 64 }}
        transition={{ duration: 0.8 }}
      />
      <Diamond size={12} className="text-[var(--gold)]" />
      <motion.div
        className="h-px w-16 bg-gradient-to-l from-transparent to-[var(--gold)]"
        initial={{ width: 0 }}
        whileInView={{ width: 64 }}
        transition={{ duration: 0.8 }}
      />
    </div>
  );
}

// ==========================================
// ANIMATED COUNTER
// ==========================================
function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return <span ref={ref}>{count}{suffix}</span>;
}

// ==========================================
// NAVIGATION
// ==========================================
function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.8 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
        ? "bg-white/80 backdrop-blur-xl shadow-lg shadow-black/5 py-4"
        : "bg-transparent py-6"
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <motion.div
          className="flex items-center gap-3"
          whileHover={{ scale: 1.02 }}
        >
          <div className="relative h-12 w-auto">
            <Image
              src="/luma-logo.png"
              alt="LUMA Logo"
              width={160}
              height={48}
              className="object-contain h-full w-auto"
              priority
            />
          </div>
        </motion.div>

        <div className="hidden md:flex items-center gap-8">
          {["Diferenciais", "Portfólio", "Planos", "Depoimentos"].map((item, i) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm tracking-wide text-gray-600 hover:text-[var(--gold)] transition-colors relative group"
              whileHover={{ y: -2 }}
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-[var(--gold)] group-hover:w-full transition-all duration-300" />
            </motion.a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <motion.a
            href="/login"
            className="text-sm font-medium tracking-wide text-gray-600 hover:text-[var(--gold)] transition-colors px-4 py-2"
            whileHover={{ y: -2 }}
          >
            Login
          </motion.a>

          <motion.a
            href="https://wa.me/5511999999999"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05, boxShadow: "0 10px 40px rgba(201, 169, 98, 0.3)" }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 bg-gradient-to-r from-[var(--gold)] to-[#b08f4f] text-white px-6 py-2.5 text-sm font-medium tracking-wide rounded-sm"
          >
            <MessageCircle size={16} />
            Fale Conosco
          </motion.a>
        </div>
      </div>
    </motion.nav>
  );
}

// ==========================================
// HERO SECTION - PREMIUM VERSION
// ==========================================
function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={ref} className="min-h-screen flex items-center justify-center px-6 pt-32 pb-20 relative overflow-hidden">
      <AnimatedBackground />

      <motion.div style={{ y, opacity }} className="max-w-6xl mx-auto text-center relative z-10">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="inline-flex items-center gap-2 px-5 py-2 mb-8 border border-[var(--gold-light)] bg-white/50 backdrop-blur-sm"
        >
          <Gem size={14} className="text-[var(--gold)]" />
          <span className="text-xs font-medium tracking-[0.25em] uppercase text-gray-600">
            Estúdio de Tecnologia para Casamentos
          </span>
          <Gem size={14} className="text-[var(--gold)]" />
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-medium leading-[1.1] mb-8"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          <span className="block">Não alugue um template.</span>
          <motion.span
            className="block mt-2 bg-gradient-to-r from-[var(--gold)] via-[#e8d4a8] to-[var(--gold)] bg-clip-text text-transparent"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{ duration: 5, repeat: Infinity }}
            style={{ backgroundSize: "200% 200%" }}
          >
            <span className="italic">Contrate um Estúdio Digital</span>
          </motion.span>
          <span className="block mt-2">para o seu Casamento.</span>
        </motion.h1>

        {/* Subheadline with icons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-wrap justify-center gap-6 mb-12 text-gray-500"
        >
          {[
            { icon: Palette, text: "Identidade Visual Exclusiva" },
            { icon: MessageCircle, text: "RSVP via WhatsApp" },
            { icon: Gift, text: "PIX Direto" },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-2 text-sm"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + i * 0.1 }}
            >
              <item.icon size={16} className="text-[var(--gold)]" />
              <span>{item.text}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.a
            href="/login"
            className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-[var(--gold)] to-[#b08f4f] text-white px-10 py-5 text-lg font-medium tracking-wide overflow-hidden"
            whileHover={{ scale: 1.05, boxShadow: "0 20px 60px rgba(201, 169, 98, 0.4)" }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-[#b08f4f] to-[var(--gold)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Sparkles size={22} className="relative z-10" />
            <span className="relative z-10">Criar Site Grátis</span>
            <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
          </motion.a>

          <motion.a
            href="#portfolio"
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-[var(--gold)] transition-colors px-6 py-4 border border-gray-200 hover:border-[var(--gold)] bg-white/50 backdrop-blur-sm"
          >
            <Play size={18} />
            <span>Ver Modelos</span>
          </motion.a>
        </motion.div>

        {/* Stats mini */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="grid grid-cols-3 gap-8 mt-16 pt-16 border-t border-gray-100 max-w-2xl mx-auto"
        >
          {[
            { value: 150, suffix: "+", label: "Casamentos" },
            { value: 98, suffix: "%", label: "Satisfação" },
            { value: 50, suffix: "k+", label: "Convidados" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-3xl md:text-4xl font-light text-[var(--gold)]" style={{ fontFamily: "var(--font-playfair)" }}>
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-xs text-gray-400 uppercase tracking-wider mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2 text-gray-400"
          >
            <span className="text-xs tracking-widest uppercase">Scroll</span>
            <ChevronDown size={20} />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

// ==========================================
// DIFERENCIAIS SECTION - PREMIUM VERSION
// ==========================================
function DiferenciaisSection() {
  const diferenciais = [
    {
      icon: Palette,
      title: "Design Sob Medida",
      description: "Cada pixel é pensado para refletir a personalidade única do casal. Nada de templates — aqui, a arte é feita à mão.",
      features: ["Identidade visual exclusiva", "Paleta de cores personalizada", "Tipografia selecionada"],
    },
    {
      icon: MessageCircle,
      title: "RSVP Inteligente",
      description: "Confirmação com um toque no WhatsApp. Sem cadastros, sem senhas. A tecnologia que os seus convidados merecem.",
      features: ["Confirmação instantânea", "Lembretes automáticos", "Dashboard em tempo real"],
    },
    {
      icon: Gift,
      title: "Lista de Presentes Premium",
      description: "PIX direto na tela, sem redirecionamentos. Taxa menor do mercado e repasse em até 24h.",
      features: ["Checkout sem fricção", "Taxa de apenas 3.9%", "Repasse imediato via PIX"],
    },
    {
      icon: Camera,
      title: "Galeria Inteligente",
      description: "Álbum colaborativo onde convidados compartilham fotos em tempo real. Memórias que não se perdem.",
      features: ["Upload instantâneo", "Moderação automática", "Download em alta resolução"],
    },
    {
      icon: MapPin,
      title: "Mapa Interativo",
      description: "Localização dos eventos com rotas, estacionamento, hotéis próximos e dicas exclusivas para os convidados.",
      features: ["Integração Google Maps", "Dicas de hospedagem", "Timeline do evento"],
    },
    {
      icon: Shield,
      title: "Segurança & Privacidade",
      description: "Acesso protegido por senha. Apenas convidados autorizados visualizam seu site especial.",
      features: ["Acesso por convite", "Dados criptografados", "LGPD compliant"],
    },
  ];

  return (
    <section id="diferenciais" className="py-32 px-6 bg-white relative overflow-hidden">
      <TextureBackground opacity={0.2} />
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.1em" }}
            whileInView={{ opacity: 1, letterSpacing: "0.3em" }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-[var(--gold)] font-medium uppercase text-sm mb-4"
          >
            Por que nos escolher
          </motion.p>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-medium mb-6"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Tecnologia que <span className="italic text-[var(--gold)]">encanta</span>
          </h2>
          <LuxuryDivider className="mb-6" />
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Cada detalhe foi pensado para transformar seu casamento em uma experiência digital inesquecível.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {diferenciais.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -12, boxShadow: "0 30px 60px rgba(0,0,0,0.08)" }}
              className="group relative p-8 bg-gradient-to-b from-white to-gray-50/50 border border-gray-100 hover:border-[var(--gold-light)] transition-all duration-500"
            >
              {/* Decorative corner */}
              <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-2 bg-gradient-to-l from-[var(--gold)] to-transparent transform rotate-45 translate-x-8 -translate-y-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Icon */}
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.8 }}
                className="w-16 h-16 mb-6 flex items-center justify-center border-2 border-[var(--gold-light)] text-[var(--gold)] group-hover:bg-[var(--gold)] group-hover:text-white group-hover:border-[var(--gold)] transition-all duration-500"
              >
                <item.icon size={28} strokeWidth={1.5} />
              </motion.div>

              {/* Content */}
              <h3
                className="text-xl font-medium mb-3 group-hover:text-[var(--gold)] transition-colors"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {item.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                {item.description}
              </p>

              {/* Features list */}
              <ul className="space-y-2">
                {item.features.map((feature, i) => (
                  <motion.li
                    key={i}
                    className="flex items-center gap-2 text-xs text-gray-400"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                  >
                    <Check size={12} className="text-[var(--gold)]" />
                    {feature}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ==========================================
// ABOUT SECTION
// ==========================================
function AboutSection() {
  return (
    <section id="sobre" className="py-32 px-6 bg-[#fdfcfa] relative overflow-hidden">
      <TextureBackground opacity={0.3} />
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center relative z-10">
        {/* Left Column - Image Placeholder */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="aspect-[3/4] md:aspect-square relative">
            {/* Decorative frames */}
            <div className="absolute inset-0 border border-[var(--gold-light)] transform translate-x-4 translate-y-4" />
            <div className="absolute inset-0 border border-gray-100 transform -translate-x-4 -translate-y-4" />

            {/* Image Area */}
            <div className="absolute inset-0 bg-[#f5f5f5] flex flex-col items-center justify-center p-8 text-center border border-[var(--gold)]/20">
              <div className="w-16 h-16 mb-4 rounded-full bg-[var(--gold)]/10 flex items-center justify-center text-[var(--gold)]">
                <Heart size={24} />
              </div>
              <p className="text-[var(--gold)] font-medium tracking-[0.2em] uppercase text-xs mb-2">
                Foto dos Fundadores
              </p>
              <p className="text-gray-400 text-xs max-w-[200px]">
                Aguardando envio da imagem para atualização.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Right Column - Content */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <p className="text-[var(--gold)] font-medium tracking-[0.3em] uppercase text-sm mb-4">
            Nossa História
          </p>
          <h2
            className="text-4xl md:text-5xl font-medium mb-6"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            De Noivos para <span className="italic text-[var(--gold)]">Noivos</span>
          </h2>

          <LuxuryDivider className="mb-8 !justify-start" />

          <div className="space-y-6 text-gray-500 leading-relaxed">
            <p>
              Tudo começou com o nosso próprio casamento. Ao buscarmos um site que refletisse nossa identidade, nos deparamos com o mercado tradicional: templates rígidos que não nos representavam e taxas abusivas sobre nossos presentes.
            </p>
            <p>
              Não aceitamos o 'padrão'. Decidimos usar nossa expertise em tecnologia para criar o que nós mesmos sonhávamos: um estúdio digital que trata cada casamento como uma obra única.
            </p>
            <p className="font-medium text-gray-800">
              Sem taxas escondidas, sem limitações criativas. Apenas a liberdade de celebrar o amor do seu jeito.
            </p>
          </div>

          <div className="mt-10">
            <motion.div
              className="inline-flex items-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex -space-x-4">
                {/* Signatures or avatars could go here, keeping it simple for now */}
              </div>
              <div>
                <p className="font-serif text-lg italic text-[var(--gold)]">Matheus & Eduarda</p>
                <p className="text-xs uppercase tracking-widest text-gray-400">Fundadores LUMA</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ==========================================
// PORTFOLIO SECTION - PREMIUM VERSION
// ==========================================
function PortfolioSection() {
  const cases = [
    {
      name: "Ana & Pedro",
      date: "Março 2024",
      location: "Vinícola Aurora, RS",
      subtitle: "Casamento na Vinícola",
      style: "Rústico-Chique • Destination Wedding",
      description: "Um casamento íntimo entre vinhedos, celebrando o amor com a sofisticação da natureza. Design inspirado na terra e nos tons do pôr do sol.",
      destaques: [
        "Mapa interativo com rotas",
        "Guia de hospedagem integrado",
        "Galeria colaborativa"
      ],
      stats: { convidados: 180, fotos: "2.400+", rsvp: "96%" },
      bgGradient: "linear-gradient(135deg, #8B7355 0%, #5a6f4c 50%, #c67d5e 100%)",
      mockupStyle: "rustic",
    },
    {
      name: "Juliana & Roberto",
      date: "Junho 2024",
      location: "Palácio Tangará, SP",
      subtitle: "Royal Wedding",
      style: "Clássico Atemporal • Black Tie",
      description: "Elegância em cada detalhe. Um casamento que combina tradição e modernidade, com brasão exclusivo e animações cinematográficas.",
      destaques: [
        "Brasão vetorizado exclusivo",
        "Animações de entrada premium",
        "RSVP formal com dress code"
      ],
      stats: { convidados: 350, fotos: "4.800+", rsvp: "99%" },
      bgGradient: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #c9a962 100%)",
      mockupStyle: "classic",
    },
    {
      name: "Lucas & Beatriz",
      date: "Dezembro 2024",
      location: "Espaço Gardens, RJ",
      subtitle: "Neon Party",
      style: "Moderno Gen-Z • After Party",
      description: "Quebrando todas as regras com estilo. Dark mode, neon vibrante e uma experiência digital que é pura festa.",
      destaques: [
        "Feed estilo Instagram",
        "Playlist colaborativa Spotify",
        "Countdown animado"
      ],
      stats: { convidados: 220, fotos: "3.100+", rsvp: "97%" },
      bgGradient: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #ff2d92 100%)",
      mockupStyle: "neon",
    },
  ];

  return (
    <section id="portfolio" className="py-32 px-6 bg-[#faf9f7] relative overflow-hidden">
      {/* Background decoration */}
      <TextureBackground opacity={0.3} />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <p className="text-[var(--gold)] font-medium tracking-[0.3em] uppercase text-sm mb-4">
            Portfólio
          </p>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-medium mb-6"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Cases de <span className="italic text-[var(--gold)]">Sucesso</span>
          </h2>
          <LuxuryDivider className="mb-6" />
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Cada projeto é uma obra única, desenvolvida para eternizar a história de amor de cada casal.
          </p>
        </motion.div>

        {/* Cases Grid */}
        <div className="space-y-20">
          {cases.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? "lg:grid-flow-dense" : ""
                }`}
            >
              {/* Mockup */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className={`relative ${index % 2 === 1 ? "lg:col-start-2" : ""}`}
              >
                {/* Phone mockup frame */}
                <div className="relative mx-auto max-w-sm">
                  {/* Phone frame */}
                  <div className="relative bg-gray-900 rounded-[3rem] p-3 shadow-2xl shadow-black/20">
                    {/* Notch */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-7 bg-gray-900 rounded-b-2xl z-10" />

                    {/* Screen */}
                    <div
                      className="relative rounded-[2.5rem] overflow-hidden aspect-[9/19]"
                      style={{ background: project.bgGradient }}
                    >
                      {/* Mockup content based on style */}
                      {project.mockupStyle === "rustic" && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-white">
                          <div className="w-full space-y-6">
                            {/* Decorative leaves */}
                            <div className="flex justify-center opacity-60">
                              <svg width="80" height="40" viewBox="0 0 80 40">
                                <path d="M40,35 Q20,20 5,25 Q20,15 40,5 Q60,15 75,25 Q60,20 40,35" fill="none" stroke="currentColor" strokeWidth="1" />
                              </svg>
                            </div>
                            <p className="text-center text-xs tracking-[0.4em] uppercase opacity-70">Casamento</p>
                            <h4 className="text-center text-3xl italic" style={{ fontFamily: "var(--font-playfair)" }}>
                              {project.name}
                            </h4>
                            <p className="text-center text-xs tracking-widest opacity-60">{project.date}</p>
                            <div className="w-16 h-px bg-white/30 mx-auto" />
                            <p className="text-center text-[10px] opacity-50">{project.location}</p>
                          </div>
                        </div>
                      )}

                      {project.mockupStyle === "classic" && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-white bg-[#0f0f0f]">
                          <div className="w-full space-y-6">
                            {/* Elegant frame corners */}
                            <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-[#c9a962]" />
                            <div className="absolute top-8 right-8 w-12 h-12 border-t-2 border-r-2 border-[#c9a962]" />
                            <div className="absolute bottom-8 left-8 w-12 h-12 border-b-2 border-l-2 border-[#c9a962]" />
                            <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-[#c9a962]" />

                            {/* Monogram */}
                            <div className="w-24 h-24 mx-auto border-2 border-[#c9a962] flex items-center justify-center">
                              <span className="text-3xl text-[#c9a962]" style={{ fontFamily: "var(--font-playfair)" }}>
                                J&R
                              </span>
                            </div>
                            <p className="text-center text-[10px] tracking-[0.5em] uppercase text-[#c9a962]">
                              Convidam para o seu
                            </p>
                            <h4 className="text-center text-2xl tracking-widest uppercase" style={{ fontFamily: "var(--font-playfair)" }}>
                              Casamento
                            </h4>
                            <p className="text-center text-xs opacity-60">{project.date}</p>
                          </div>
                        </div>
                      )}

                      {project.mockupStyle === "neon" && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-white">
                          {/* Neon glow effects */}
                          <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-3xl opacity-30 bg-[#ff2d92]" />
                          <div className="absolute bottom-1/3 right-1/4 w-32 h-32 rounded-full blur-2xl opacity-20 bg-[#00d4ff]" />

                          <div className="w-full space-y-4 relative z-10">
                            <p className="text-center text-[10px] font-bold tracking-[0.4em] uppercase text-[#00d4ff]">
                              Save the Date
                            </p>
                            <h4
                              className="text-center text-4xl font-black uppercase"
                              style={{
                                textShadow: "0 0 20px #ff2d92, 0 0 40px #ff2d92",
                                fontFamily: "var(--font-lato)"
                              }}
                            >
                              Lucas
                            </h4>
                            <p className="text-center text-2xl text-[#ff2d92]">&</p>
                            <h4
                              className="text-center text-4xl font-black uppercase"
                              style={{
                                textShadow: "0 0 20px #00d4ff, 0 0 40px #00d4ff",
                                fontFamily: "var(--font-lato)"
                              }}
                            >
                              Beatriz
                            </h4>
                            <div className="w-24 h-1 mx-auto mt-4 rounded bg-gradient-to-r from-[#ff2d92] to-[#00d4ff]" />
                            <p className="text-center text-xs opacity-60 mt-4">{project.date}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Reflection effect */}
                  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-3/4 h-8 bg-gradient-to-b from-black/10 to-transparent blur-xl" />
                </div>
              </motion.div>

              {/* Content */}
              <div className={`space-y-6 ${index % 2 === 1 ? "lg:col-start-1 lg:row-start-1" : ""}`}>
                <div className="flex items-center gap-3">
                  <span className="text-xs tracking-widest uppercase text-gray-400">{project.date}</span>
                  <span className="w-8 h-px bg-gray-300" />
                  <span className="text-xs text-gray-400">{project.location}</span>
                </div>

                <h3
                  className="text-3xl md:text-4xl font-medium"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {project.name}
                </h3>

                <p className="text-[var(--gold)] font-medium text-sm tracking-wide">
                  {project.style}
                </p>

                <p className="text-gray-500 leading-relaxed">
                  {project.description}
                </p>

                {/* Features */}
                <div className="space-y-3 py-4">
                  {project.destaques.map((destaque, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-6 h-6 rounded-full bg-[var(--gold-light)] flex items-center justify-center">
                        <Check size={12} className="text-[var(--gold)]" />
                      </div>
                      <span className="text-sm text-gray-600">{destaque}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex gap-8 pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-2xl font-light text-[var(--gold)]">{project.stats.convidados}</p>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">Convidados</p>
                  </div>
                  <div>
                    <p className="text-2xl font-light text-[var(--gold)]">{project.stats.fotos}</p>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">Fotos</p>
                  </div>
                  <div>
                    <p className="text-2xl font-light text-[var(--gold)]">{project.stats.rsvp}</p>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">RSVP</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ==========================================
// PRICING SECTION
// ==========================================
function PricingSection() {
  const plans = [
    {
      name: "Essential",
      price: "Grátis",
      description: "Para casais que buscam simplicidade e elegância.",
      features: [
        "Acesso a templates básicos",
        "Edição de textos e datas",
        "RSVP via WhatsApp",
        "Link para lista de presentes",
        "Marca d'água LUMA",
      ],
      cta: "Começar Grátis",
      highlight: false,
    },
    {
      name: "Gold",
      price: "R$ 97",
      period: "/único",
      description: "Mais personalização e recursos exclusivos para seu dia.",
      features: [
        "Todas as funcionalidades Essential",
        "Edição avançada (Cores/Fontes)",
        "Página de Presentes (PIX 0% taxa)",
        "Galeria de Fotos do Casal",
        "Suporte Prioritário",
        "Sem marca d'água",
      ],
      cta: "Escolher Gold",
      highlight: true,
      badge: "Mais Popular",
    },
    {
      name: "Exclusive",
      price: "R$ 197",
      period: "/único",
      description: "A experiência completa de um estúdio digital.",
      features: [
        "Consultoria de 1h com Fundadores",
        "Design 100% Personalizado",
        "Domínio personalizado (.com)",
        "Direção de Arte Exclusiva",
        "Concierge Digital",
      ],
      cta: "Falar com Consultor",
      highlight: false,
      dark: true,
    },
  ];

  return (
    <section id="planos" className="py-32 px-6 bg-white relative overflow-hidden">
      <TextureBackground opacity={0.2} />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <p className="text-[var(--gold)] font-medium tracking-[0.3em] uppercase text-sm mb-4">
            Nossos Planos
          </p>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-medium mb-6"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Escolha sua <span className="italic text-[var(--gold)]">Experiência</span>
          </h2>
          <LuxuryDivider className="mb-6" />
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 items-start">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -10 }}
              className={`relative p-8 rounded-2xl border transition-all duration-300 ${plan.dark
                ? "bg-[#1a3c34] border-[#1a3c34] text-white"
                : plan.highlight
                  ? "bg-white border-[var(--gold)] shadow-xl shadow-[var(--gold)]/10"
                  : "bg-white border-gray-100"
                }`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[var(--gold)] text-white text-xs font-medium tracking-wider uppercase px-4 py-1.5 rounded-full shadow-lg">
                  {plan.badge}
                </div>
              )}

              <h3 className={`text-2xl font-medium mb-2 ${plan.dark ? "text-white" : "text-gray-900"}`} style={{ fontFamily: "var(--font-playfair)" }}>
                {plan.name}
              </h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className={`text-4xl font-bold ${plan.dark ? "text-[var(--gold)]" : "text-gray-900"}`}>
                  {plan.price}
                </span>
                {plan.period && <span className={`text-sm ${plan.dark ? "text-gray-400" : "text-gray-500"}`}>{plan.period}</span>}
              </div>
              <p className={`text-sm mb-8 leading-relaxed ${plan.dark ? "text-gray-300" : "text-gray-500"}`}>
                {plan.description}
              </p>

              <div className={`h-px w-full mb-8 ${plan.dark ? "bg-white/10" : "bg-gray-100"}`} />

              <ul className="space-y-4 mb-10">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <Check size={16} className={`mt-0.5 shrink-0 ${plan.dark ? "text-[var(--gold)]" : "text-[var(--gold)]"}`} />
                    <span className={plan.dark ? "text-gray-300" : "text-gray-600"}>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-4 rounded-lg font-medium text-sm tracking-wide transition-all ${plan.dark
                  ? "bg-[var(--gold)] text-white hover:bg-[#b08f4f]"
                  : plan.highlight
                    ? "bg-gray-900 text-white hover:bg-gray-800"
                    : "bg-gray-50 text-gray-900 hover:bg-gray-100"
                  }`}
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ==========================================
// TESTIMONIALS SECTION
// ==========================================
function TestimonialsSection() {
  const testimonials = [
    {
      quote: "Nosso site ficou mais lindo do que imaginávamos. Os convidados não paravam de elogiar! O RSVP via WhatsApp foi um sucesso absoluto.",
      author: "Ana & Pedro",
      role: "Casamento em Março 2024",
      avatar: "A",
    },
    {
      quote: "Profissionalismo impecável. Entenderam exatamente o que queríamos e entregaram algo ainda melhor. Recomendo de olhos fechados.",
      author: "Juliana & Roberto",
      role: "Casamento em Junho 2024",
      avatar: "J",
    },
    {
      quote: "O site ficou a nossa cara! Moderno, diferente e com aquela pegada de festa que a gente queria. Os convidados amaram!",
      author: "Lucas & Beatriz",
      role: "Casamento em Dezembro 2024",
      avatar: "L",
    },
  ];

  return (
    <section id="depoimentos" className="py-32 px-6 bg-gradient-to-b from-white to-[#faf9f7] relative overflow-hidden">
      {/* Background quote */}
      <div className="absolute top-20 left-10 text-[200px] font-serif text-gray-100 opacity-50 pointer-events-none select-none">
        "
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <p className="text-[var(--gold)] font-medium tracking-[0.3em] uppercase text-sm mb-4">
            Depoimentos
          </p>
          <h2
            className="text-4xl md:text-5xl font-medium mb-6"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            O que dizem os <span className="italic text-[var(--gold)]">casais</span>
          </h2>
          <LuxuryDivider />
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              whileHover={{ y: -8 }}
              className="relative bg-white p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-50"
            >
              {/* Quote icon */}
              <Quote size={32} className="text-[var(--gold-light)] mb-6" />

              {/* Quote text */}
              <p className="text-gray-600 leading-relaxed mb-8 italic">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--gold)] to-[#b08f4f] flex items-center justify-center text-white font-medium">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-medium" style={{ fontFamily: "var(--font-playfair)" }}>
                    {testimonial.author}
                  </p>
                  <p className="text-xs text-gray-400">{testimonial.role}</p>
                </div>
              </div>

              {/* Stars */}
              <div className="absolute top-8 right-8 flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={12} className="text-[var(--gold)] fill-[var(--gold)]" />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-8 mt-16 pt-16 border-t border-gray-100"
        >
          {[
            { icon: Award, text: "Top 10 Tech Casamentos 2024" },
            { icon: Users, text: "150+ Casamentos Realizados" },
            { icon: Heart, text: "4.9/5 Avaliação Média" },
          ].map((badge, i) => (
            <div key={i} className="flex items-center gap-3 text-gray-400">
              <badge.icon size={20} className="text-[var(--gold)]" />
              <span className="text-sm">{badge.text}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ==========================================
// FAQ SECTION
// ==========================================
function FAQSection() {
  const faqs = [
    {
      q: "O plano grátis é realmente grátis?",
      a: "Sim! Você pode criar seu site, editar templates básicos e usar o RSVP sem pagar nada. O plano gratuito inclui uma marca d'água discreta no rodapé.",
    },
    {
      q: "Posso mudar de plano depois?",
      a: "Com certeza. Você pode começar no plano gratuito e fazer o upgrade para o Gold a qualquer momento para desbloquear recursos extras como a Lista de Presentes.",
    },
    {
      q: "Como funciona a Lista de Presentes?",
      a: "No plano Gold, você cria uma lista com presentes fictícios (ex: 'Jantar Romântico'). Seus convidados 'compram' e você recebe o valor integral via PIX na sua conta, sem taxas da plataforma.",
    },
    {
      q: "O site expira?",
      a: "Seu site fica no ar por 12 meses após a data do casamento, servindo como um álbum digital de recordação.",
    },
  ];

  return (
    <section className="py-24 px-6 bg-[#faf9f7] relative">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-medium mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
            Dúvidas Frequentes
          </h2>
          <p className="text-gray-500">Tire suas dúvidas e comece a criar seu site hoje.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl border border-gray-100 p-6 hover:border-[var(--gold)] transition-colors"
            >
              <h3 className="font-medium text-lg mb-2 text-[#1a3c34]">{item.q}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.a}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ==========================================
// STICKY MOBILE CTA
// ==========================================
function StickyCTA() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past hero (approx 600px)
      setShow(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t border-gray-100 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] md:hidden"
        >
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Comece Agora</p>
              <p className="font-medium text-[#1a3c34]" style={{ fontFamily: "var(--font-playfair)" }}>Seu site de casamento</p>
            </div>
            <a
              href="/login"
              className="bg-[var(--gold)] text-white px-6 py-3 rounded-lg font-medium text-sm"
            >
              Criar Grátis
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ==========================================
// CERIMONIALISTAS SECTION - PREMIUM VERSION
// ==========================================
function CerimoniaalistasSection() {
  const benefits = [
    { icon: Crown, title: "Sua Marca, Seu Crédito", desc: "O site leva sua marca no rodapé" },
    { icon: Gem, title: "Zero Investimento", desc: "Sem mensalidade, sem taxa de adesão" },
    { icon: Clock, title: "Suporte Prioritário", desc: "Atendimento dedicado para parceiros" },
    { icon: Users, title: "Dashboard Exclusivo", desc: "Gerencie todos os seus clientes" },
  ];

  return (
    <section id="parceiros" className="py-32 px-6 bg-[#0f0f0f] text-white relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute w-96 h-96 rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #c9a962 0%, transparent 70%)",
            top: "10%",
            right: "10%",
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 border border-[var(--gold)]/30 mb-8"
            >
              <Handshake size={16} className="text-[var(--gold)]" />
              <span className="text-xs tracking-[0.2em] uppercase text-[var(--gold)]">
                Programa de Parceiros
              </span>
            </motion.div>

            <h2
              className="text-4xl md:text-5xl font-medium mb-6"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Parceiro{" "}
              <span className="italic text-[var(--gold)]">Cerimonialista</span>
            </h2>

            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              Ofereça tecnologia premium aos seus clientes como{" "}
              <span className="text-white font-semibold">White Label</span>.
              Agregue valor ao seu serviço com sites exclusivos que levam a sua marca.
            </p>

            {/* Benefits grid */}
            <div className="grid grid-cols-2 gap-6 mb-10">
              {benefits.map((benefit, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-10 h-10 border border-[var(--gold)]/30 flex items-center justify-center flex-shrink-0">
                    <benefit.icon size={18} className="text-[var(--gold)]" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{benefit.title}</p>
                    <p className="text-xs text-gray-500">{benefit.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.a
              href="https://wa.me/5511999999999?text=Olá! Sou cerimonialista e quero conhecer a parceria."
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, boxShadow: "0 20px 60px rgba(201, 169, 98, 0.3)" }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-[var(--gold)] to-[#b08f4f] text-white px-8 py-4 text-lg font-medium tracking-wide"
            >
              <MessageCircle size={20} />
              Quero ser Parceiro
              <ArrowRight size={18} />
            </motion.a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-6">
              {[
                { value: "100%", label: "Sua marca no rodapé", sub: "White Label completo" },
                { value: "R$ 0", label: "Investimento inicial", sub: "Sem mensalidades" },
                { value: "24h", label: "Tempo de resposta", sub: "Suporte prioritário" },
                { value: "+30", label: "Parceiros ativos", sub: "Em todo Brasil" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="p-6 border border-gray-800 hover:border-[var(--gold)]/30 transition-colors bg-gradient-to-b from-gray-900/50 to-transparent"
                >
                  <p className="text-3xl font-light text-[var(--gold)] mb-2" style={{ fontFamily: "var(--font-playfair)" }}>
                    {stat.value}
                  </p>
                  <p className="text-sm font-medium text-white">{stat.label}</p>
                  <p className="text-xs text-gray-500">{stat.sub}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ==========================================
// CTA SECTION
// ==========================================
function CTASection() {
  return (
    <section className="py-24 px-6 bg-gradient-to-r from-[var(--gold)] via-[#d4b56a] to-[var(--gold)] relative overflow-hidden">
      {/* Animated pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="cta-pattern" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
              <circle cx="5" cy="5" r="1" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cta-pattern)" />
        </svg>
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Heart size={40} className="mx-auto text-white/80 mb-6" />
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-medium text-white mb-6"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Pronto para criar algo <span className="italic">inesquecível?</span>
          </h2>
          <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
            Vamos transformar seu casamento em uma experiência digital única.
            Agende uma conversa sem compromisso.
          </p>

          <motion.a
            href="https://wa.me/5511999999999?text=Olá! Quero saber mais sobre os sites para casamento."
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05, boxShadow: "0 10px 40px rgba(0,0,0,0.2)" }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-3 bg-white text-[var(--gold)] px-10 py-5 text-lg font-semibold tracking-wide"
          >
            <MessageCircle size={22} />
            Agendar Conversa Gratuita
            <ArrowRight size={18} />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}

// ==========================================
// FOOTER - PREMIUM VERSION
// ==========================================
function Footer() {
  return (
    <footer className="py-16 px-6 bg-[#0a0a0a] text-white">
      <div className="max-w-6xl mx-auto">
        {/* Main footer content */}
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative h-12 w-auto">
                <Image
                  src="/luma-logo.png"
                  alt="LUMA Logo"
                  width={160}
                  height={48}
                  className="object-contain h-full w-auto brightness-0 invert"
                />
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm mb-6">
              Estúdio de Tecnologia para Casamentos. Criamos experiências digitais exclusivas
              que eternizam o amor de cada casal.
            </p>
            <div className="flex gap-4">
              {[Instagram, Mail, Phone].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ y: -4, color: "#c9a962" }}
                  className="w-10 h-10 border border-gray-800 hover:border-[var(--gold)] flex items-center justify-center text-gray-400 transition-colors"
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-medium mb-4 text-sm tracking-wider uppercase">Links</h4>
            <ul className="space-y-3">
              {["Diferenciais", "Portfólio", "Depoimentos", "Parceiros"].map((link) => (
                <li key={link}>
                  <a href={`#${link.toLowerCase()}`} className="text-gray-400 hover:text-[var(--gold)] text-sm transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-medium mb-4 text-sm tracking-wider uppercase">Contato</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>contato@weddingtech.com.br</li>
              <li>+55 (11) 99999-9999</li>
              <li>São Paulo, SP</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} LUMA. Todos os direitos reservados.
          </p>
          <div className="flex gap-6 text-xs text-gray-500">
            <a href="#" className="hover:text-[var(--gold)] transition-colors">Termos de Uso</a>
            <a href="#" className="hover:text-[var(--gold)] transition-colors">Política de Privacidade</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ==========================================
// MAIN PAGE
// ==========================================
export default function Home() {
  return (
    <main className="min-h-screen relative">
      <FloatingParticles />
      <Navigation />
      <HeroSection />
      <DiferenciaisSection />
      <AboutSection />
      <PortfolioSection />
      <PricingSection />
      <TestimonialsSection />
      <CerimoniaalistasSection />
      <CTASection />
      <FAQSection />
      <Footer />
      <StickyCTA />
    </main>
  );
}
