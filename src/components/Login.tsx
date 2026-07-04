import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { type Language } from '../i18n';

interface LoginProps {
  lang: Language;
  onLogin: () => void;
  initialMode?: 'signin' | 'signup';
}

const loginTranslations = {
  pt: {
    welcomeBack: "Bem-vindo de volta",
    signInToAccount: "Faça login na sua conta",
    createAccount: "Criar conta",
    joinUsToday: "Junte-se a nós hoje",
    continueWithGoogle: "Continuar com o Google",
    continueWithX: "Continuar com o X",
    signUpWithGoogle: "Cadastrar com o Google",
    signUpWithX: "Cadastrar com o X",
    or: "OU",
    name: "Nome completo",
    enterName: "Digite seu nome",
    email: "E-mail",
    enterEmail: "Digite seu e-mail",
    dontHaveAccount: "Não tem uma conta?",
    signUp: "Cadastre-se",
    alreadyHaveAccount: "Já tem uma conta?",
    signIn: "Entrar",
    guestBypass: "Entrar como Visitante",
    choosePlan: "Escolha seu plano",
    selectPlanDesc: "Selecione a melhor opção para começar",
    basicPlanName: "Plano Básico",
    basicPlanPrice: "Grátis",
    basicPlanDesc: "Acesso básico às visualizações de componentes",
    standardPlanName: "Plano Padrão",
    standardPlanPrice: "R$ 49,90/mês",
    standardPlanDesc: "Cópia de prompts ilimitada e suporte prioritário",
    proPlanName: "Plano Pro",
    proPlanPrice: "R$ 99,90/mês",
    proPlanDesc: "Acesso total aos componentes 3D e WebGL premium",
    recommended: "Recomendado",
    continueToLibrary: "Continuar para a Biblioteca",
    backToRegister: "Voltar para o cadastro"
  },
  en: {
    welcomeBack: "Welcome back",
    signInToAccount: "Sign in to your account",
    createAccount: "Create account",
    joinUsToday: "Join us today",
    continueWithGoogle: "Continue with Google",
    continueWithX: "Continue with X",
    signUpWithGoogle: "Sign up with Google",
    signUpWithX: "Sign up with X",
    or: "OR",
    name: "Full name",
    enterName: "Enter your name",
    email: "Email",
    enterEmail: "Enter your email",
    dontHaveAccount: "Don't have an account?",
    signUp: "Sign up",
    alreadyHaveAccount: "Already have an account?",
    signIn: "Sign in",
    guestBypass: "Browse as Guest",
    choosePlan: "Choose your plan",
    selectPlanDesc: "Select the best option to get started",
    basicPlanName: "Basic Plan",
    basicPlanPrice: "Free",
    basicPlanDesc: "Basic access to component previews",
    standardPlanName: "Standard Plan",
    standardPlanPrice: "$9.99/mo",
    standardPlanDesc: "Unlimited prompt copies and priority support",
    proPlanName: "Pro Plan",
    proPlanPrice: "$19.99/mo",
    proPlanDesc: "Full access to premium 3D and WebGL layouts",
    recommended: "Recommended",
    continueToLibrary: "Continue to Library",
    backToRegister: "Back to sign up"
  },
  es: {
    welcomeBack: "Te damos la bienvenida",
    signInToAccount: "Inicia sesión en tu cuenta",
    createAccount: "Crear cuenta",
    joinUsToday: "Únete a nosotros hoy",
    continueWithGoogle: "Continuar con Google",
    continueWithX: "Continuar con X",
    signUpWithGoogle: "Registrarse con Google",
    signUpWithX: "Registrarse con X",
    or: "O",
    name: "Nombre completo",
    enterName: "Introduce tu nombre",
    email: "Correo electrónico",
    enterEmail: "Introduce tu correo",
    dontHaveAccount: "¿No tienes una cuenta?",
    signUp: "Regístrate",
    alreadyHaveAccount: "¿Ya tienes una cuenta?",
    signIn: "Iniciar sesión",
    guestBypass: "Explorar como Invitado",
    choosePlan: "Elige tu plan",
    selectPlanDesc: "Selecciona la mejor opción para comenzar",
    basicPlanName: "Plan Básico",
    basicPlanPrice: "Gratis",
    basicPlanDesc: "Acceso básico a las vistas previas de componentes",
    standardPlanName: "Plan Estándar",
    standardPlanPrice: "$9.99/mes",
    standardPlanDesc: "Copias ilimitadas de prompts y soporte prioritario",
    proPlanName: "Plan Pro",
    proPlanPrice: "$19.99/mes",
    proPlanDesc: "Acceso completo a componentes 3D y WebGL premium",
    recommended: "Recomendado",
    continueToLibrary: "Continuar a la Biblioteca",
    backToRegister: "Volver al registro"
  }
} as const;

// Framer Motion Animation Variants for staggering
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.05
    }
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.02,
      staggerDirection: -1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 12, filter: 'blur(2px)' },
  visible: { 
    opacity: 1, 
    y: 0, 
    filter: 'blur(0px)',
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } 
  },
  exit: { 
    opacity: 0, 
    y: -10, 
    filter: 'blur(2px)',
    transition: { duration: 0.25, ease: 'easeInOut' as const } 
  }
};

export default function Login({ lang, onLogin, initialMode = 'signin' }: LoginProps) {
  const [mode, setMode] = useState<'signin' | 'signup' | 'plans'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'standard' | 'pro'>('standard');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  
  const t = loginTranslations[lang] || loginTranslations.pt;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      if (mode === 'signin') {
        onLogin();
      } else if (mode === 'signup' && name.trim()) {
        setMode('plans');
      }
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-black flex items-center justify-center p-4 md:p-6 selection:bg-zinc-800">
      {/* ── 1. Global Background Image ───────────────────────────────── */}
      <img
        src="/login-sky.jpeg"
        alt="Background Sky"
        className="absolute inset-0 w-full h-full object-cover scale-[1.05] pointer-events-none z-0 grayscale"
      />

      {/* ── 2. Main Center Card ──────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-[1040px] min-h-[670px] bg-white border border-gray-150 rounded-[2.5rem] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col md:flex-row animate-scale-in">
        
        {/* ── 3. Left Side (Image Mask Area) ─────────────────────────── */}
        <div className="w-full md:w-[45%] min-h-[220px] md:min-h-0 bg-[#0c0c0e] relative overflow-hidden md:m-3 rounded-[2rem] shrink-0">
          <img
            src="/login-sky.jpeg"
            alt="Left Column Sky Bg"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none grayscale"
          />
          {/* Vance branding logo overlay with premium floating and hover animation */}
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center select-none pointer-events-none">
            <motion.img 
              src="/logo-lib-transparent-final.png" 
              alt="Vance Logo" 
              className="h-44 w-auto object-contain logo-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.7)]"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
              whileHover={{ scale: 1.03 }}
            />
          </div>
        </div>

        {/* ── 4. Right Side (Form Area with Staggered Framer Motion) ── */}
        <div className="w-full md:w-[55%] p-8 sm:p-12 lg:p-14 flex flex-col justify-between relative overflow-hidden bg-white min-h-[580px] md:min-h-0">
          
          <AnimatePresence mode="wait">
            
            {/* ── STAGE 1: SIGN IN ───────────────────────────────────── */}
            {mode === 'signin' && (
              <motion.div
                key="signin"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-full flex-1 flex flex-col justify-between"
              >
                <div className="w-full my-auto space-y-6 relative z-10">
                  {/* Header */}
                  <motion.div variants={itemVariants} className="text-center">
                    <h1 className="text-[40px] font-semibold text-zinc-950 tracking-tight leading-none">
                      {t.welcomeBack}
                    </h1>
                    <p className="text-sm text-zinc-500 mt-2.5 font-medium">
                      {t.signInToAccount}
                    </p>
                  </motion.div>

                  {/* Social Buttons */}
                  <div className="space-y-2.5">
                    {/* Google Button */}
                    <motion.button
                      variants={itemVariants}
                      whileTap={{ scale: 0.985 }}
                      type="button"
                      onClick={onLogin}
                      className="w-full flex items-center justify-between p-3.5 bg-gray-50 hover:bg-gray-100/80 border border-gray-200/80 hover:border-gray-300 rounded-[1.25rem] transition-all duration-300 group cursor-pointer text-sm font-semibold text-gray-800"
                    >
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        <span>{t.continueWithGoogle}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-700 transition-colors duration-300" />
                    </motion.button>

                    {/* X Button */}
                    <motion.button
                      variants={itemVariants}
                      whileTap={{ scale: 0.985 }}
                      type="button"
                      onClick={onLogin}
                      className="w-full flex items-center justify-between p-3.5 bg-gray-50 hover:bg-gray-100/80 border border-gray-200/80 hover:border-gray-300 rounded-[1.25rem] transition-all duration-300 group cursor-pointer text-sm font-semibold text-gray-800"
                    >
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 shrink-0 text-black fill-current" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                        <span>{t.continueWithX}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-700 transition-colors duration-300" />
                    </motion.button>

                    {/* Guest Button */}
                    <motion.button
                      variants={itemVariants}
                      whileTap={{ scale: 0.985 }}
                      type="button"
                      onClick={onLogin}
                      className="w-full flex items-center justify-between p-3.5 bg-gray-50 hover:bg-gray-100/80 border border-gray-200/80 hover:border-gray-300 rounded-[1.25rem] transition-all duration-300 group cursor-pointer text-sm font-semibold text-gray-800"
                    >
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 shrink-0 text-zinc-550 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                        <span>{t.guestBypass}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-700 transition-colors duration-300" />
                    </motion.button>
                  </div>

                  {/* Divider */}
                  <motion.div variants={itemVariants} className="flex items-center gap-4 my-4">
                    <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent to-gray-200" />
                    <span className="text-[10px] font-bold text-gray-450 tracking-[0.2em] uppercase select-none">{t.or}</span>
                    <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent to-gray-200" />
                  </motion.div>

                  {/* Form */}
                  <motion.form variants={itemVariants} onSubmit={handleSubmit} className="space-y-4">
                    <div className={`border rounded-[1.25rem] p-2.5 pl-5 pr-2.5 flex items-center justify-between transition-all duration-300 ${
                      focusedField === 'email'
                        ? 'border-gray-900 bg-white shadow-sm'
                        : 'border-gray-200 bg-gray-50 hover:bg-gray-100/50'
                    }`}>
                      <div className="flex-1 min-w-0 pr-2 flex flex-col">
                        <label className="text-[10px] font-bold text-gray-400 tracking-wider uppercase select-none">
                          {t.email}
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onFocus={() => setFocusedField('email')}
                          onBlur={() => setFocusedField(null)}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder={t.enterEmail}
                          className="text-gray-900 bg-transparent border-0 outline-none text-sm placeholder-gray-400 font-semibold py-0.5 w-full focus:ring-0 focus:outline-none"
                        />
                      </div>
                      
                      {/* Submit Button */}
                      <motion.div 
                        whileHover={{ scale: 1.025 }}
                        whileTap={{ scale: 0.96 }}
                        className="relative group w-[52px] h-[52px] flex items-center justify-center shrink-0"
                      >
                        <div className="absolute -inset-[3px] rounded-full bg-[conic-gradient(from_0deg,#ffffff,#e4e4e7,#d4d4d8,#f4f4f5,#d4d4d8,#e4e4e7,#ffffff)] opacity-0 group-hover:opacity-100 blur-[6px] transition-all duration-500 pointer-events-none" />
                        <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,#ffffff,#e4e4e7,#d4d4d8,#f4f4f5,#d4d4d8,#e4e4e7,#ffffff)] opacity-100 transition-all duration-300 pointer-events-none" />
                        <button
                          type="submit"
                          className="absolute inset-[2.5px] rounded-full bg-black flex items-center justify-center text-white shadow-[inset_0_2px_4px_rgba(255,255,255,0.15),inset_0_-2px_4px_rgba(0,0,0,0.8)] cursor-pointer"
                        >
                          <ArrowRight className="w-5 h-5 text-white" />
                        </button>
                      </motion.div>
                    </div>
                  </motion.form>
                </div>

                {/* Footer */}
                <motion.div variants={itemVariants} className="text-center text-xs text-gray-500 mt-8 relative z-10 select-none">
                  {t.dontHaveAccount}{' '}
                  <button 
                    onClick={() => setMode('signup')}
                    className="font-bold text-zinc-900 hover:text-black underline decoration-zinc-300 hover:decoration-black transition-colors cursor-pointer"
                  >
                    {t.signUp}
                  </button>
                </motion.div>
              </motion.div>
            )}

            {/* ── STAGE 2: SIGN UP / CREATE ACCOUNT ──────────────────── */}
            {mode === 'signup' && (
              <motion.div
                key="signup"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-full flex-1 flex flex-col justify-between"
              >
                <div className="w-full my-auto space-y-6 relative z-10">
                  {/* Header */}
                  <motion.div variants={itemVariants} className="text-center">
                    <h1 className="text-[40px] font-semibold text-zinc-950 tracking-tight leading-none">
                      {t.createAccount}
                    </h1>
                    <p className="text-sm text-zinc-500 mt-2.5 font-medium">
                      {t.joinUsToday}
                    </p>
                  </motion.div>

                  {/* Social Buttons */}
                  <div className="space-y-2.5">
                    {/* Google Button */}
                    <motion.button
                      variants={itemVariants}
                      whileTap={{ scale: 0.985 }}
                      type="button"
                      onClick={() => setMode('plans')}
                      className="w-full flex items-center justify-between p-3.5 bg-gray-50 hover:bg-gray-100/80 border border-gray-200/80 hover:border-gray-300 rounded-[1.25rem] transition-all duration-300 group cursor-pointer text-sm font-semibold text-gray-800"
                    >
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        <span>{t.signUpWithGoogle}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-700 transition-colors duration-300" />
                    </motion.button>

                    {/* X Button */}
                    <motion.button
                      variants={itemVariants}
                      whileTap={{ scale: 0.985 }}
                      type="button"
                      onClick={() => setMode('plans')}
                      className="w-full flex items-center justify-between p-3.5 bg-gray-50 hover:bg-gray-100/80 border border-gray-200/80 hover:border-gray-300 rounded-[1.25rem] transition-all duration-300 group cursor-pointer text-sm font-semibold text-gray-800"
                    >
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 shrink-0 text-black fill-current" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                        <span>{t.signUpWithX}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-700 transition-colors duration-300" />
                    </motion.button>
                  </div>

                  {/* Divider */}
                  <motion.div variants={itemVariants} className="flex items-center gap-4 my-4">
                    <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent to-gray-200" />
                    <span className="text-[10px] font-bold text-gray-450 tracking-[0.2em] uppercase select-none">{t.or}</span>
                    <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent to-gray-200" />
                  </motion.div>

                  {/* Form */}
                  <motion.form variants={itemVariants} onSubmit={handleSubmit} className="space-y-3.5">
                    {/* Name Input */}
                    <div className={`border rounded-[1.25rem] p-2.5 pl-5 pr-2.5 flex items-center transition-all duration-300 ${
                      focusedField === 'name'
                        ? 'border-gray-900 bg-white shadow-sm'
                        : 'border-gray-200 bg-gray-50 hover:bg-gray-100/50'
                    }`}>
                      <div className="flex-1 min-w-0 pr-2 flex flex-col">
                        <label className="text-[10px] font-bold text-gray-400 tracking-wider uppercase select-none">
                          {t.name}
                        </label>
                        <input
                          type="text"
                          required
                          value={name}
                          onFocus={() => setFocusedField('name')}
                          onBlur={() => setFocusedField(null)}
                          onChange={(e) => setName(e.target.value)}
                          placeholder={t.enterName}
                          className="text-gray-900 bg-transparent border-0 outline-none text-sm placeholder-gray-400 font-semibold py-0.5 w-full focus:ring-0 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Email Input + Submit */}
                    <div className={`border rounded-[1.25rem] p-2.5 pl-5 pr-2.5 flex items-center justify-between transition-all duration-300 ${
                      focusedField === 'email'
                        ? 'border-gray-900 bg-white shadow-sm'
                        : 'border-gray-200 bg-gray-50 hover:bg-gray-100/50'
                    }`}>
                      <div className="flex-1 min-w-0 pr-2 flex flex-col">
                        <label className="text-[10px] font-bold text-gray-400 tracking-wider uppercase select-none">
                          {t.email}
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onFocus={() => setFocusedField('email')}
                          onBlur={() => setFocusedField(null)}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder={t.enterEmail}
                          className="text-gray-900 bg-transparent border-0 outline-none text-sm placeholder-gray-400 font-semibold py-0.5 w-full focus:ring-0 focus:outline-none"
                        />
                      </div>
                      
                      {/* Submit Button */}
                      <motion.div 
                        whileHover={{ scale: 1.025 }}
                        whileTap={{ scale: 0.96 }}
                        className="relative group w-[52px] h-[52px] flex items-center justify-center shrink-0"
                      >
                        <div className="absolute -inset-[3px] rounded-full bg-[conic-gradient(from_0deg,#ffffff,#e4e4e7,#d4d4d8,#f4f4f5,#d4d4d8,#e4e4e7,#ffffff)] opacity-0 group-hover:opacity-100 blur-[6px] transition-all duration-500 pointer-events-none" />
                        <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,#ffffff,#e4e4e7,#d4d4d8,#f4f4f5,#d4d4d8,#e4e4e7,#ffffff)] opacity-100 transition-all duration-300 pointer-events-none" />
                        <button
                          type="submit"
                          className="absolute inset-[2.5px] rounded-full bg-black flex items-center justify-center text-white shadow-[inset_0_2px_4px_rgba(255,255,255,0.15),inset_0_-2px_4px_rgba(0,0,0,0.8)] cursor-pointer"
                        >
                          <ArrowRight className="w-5 h-5 text-white" />
                        </button>
                      </motion.div>
                    </div>
                  </motion.form>
                </div>

                {/* Footer */}
                <motion.div variants={itemVariants} className="text-center text-xs text-gray-500 mt-8 relative z-10 select-none">
                  {t.alreadyHaveAccount}{' '}
                  <button 
                    onClick={() => setMode('signin')}
                    className="font-bold text-zinc-900 hover:text-black underline decoration-zinc-300 hover:decoration-black transition-colors cursor-pointer"
                  >
                    {t.signIn}
                  </button>
                </motion.div>
              </motion.div>
            )}

            {/* ── STAGE 3: SELECT PLAN ───────────────────────────────── */}
            {mode === 'plans' && (
              <motion.div
                key="plans"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-full flex-1 flex flex-col justify-between"
              >
                <div className="w-full my-auto space-y-5 relative z-10">
                  {/* Header */}
                  <motion.div variants={itemVariants} className="text-center">
                    <h1 className="text-3xl font-semibold text-zinc-950 tracking-tight leading-none">
                      {t.choosePlan}
                    </h1>
                    <p className="text-xs text-zinc-500 mt-2 font-medium">
                      {t.selectPlanDesc}
                    </p>
                  </motion.div>

                  {/* Plan Cards Stack */}
                  <div className="space-y-3">
                    {/* Basic Plan */}
                    <motion.div
                      variants={itemVariants}
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.985 }}
                      onClick={() => setSelectedPlan('basic')}
                      className={`p-4 border-2 rounded-[1.5rem] flex items-center gap-4 cursor-pointer transition-all duration-300 relative ${
                        selectedPlan === 'basic'
                          ? 'border-zinc-950 bg-zinc-50/30 shadow-[0_4px_20px_rgba(0,0,0,0.05)]'
                          : 'border-zinc-200 hover:border-zinc-300 bg-white hover:bg-zinc-50/20'
                      }`}
                    >
                      {/* Radio button style indicator */}
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-300 ${
                        selectedPlan === 'basic' ? 'border-zinc-950 bg-zinc-950' : 'border-zinc-300 bg-white'
                      }`}>
                        {selectedPlan === 'basic' && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white animate-scale-in" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-zinc-900 uppercase tracking-wider">{t.basicPlanName}</span>
                        </div>
                        <p className="text-[11px] text-zinc-500 mt-0.5 leading-tight">
                          {t.basicPlanDesc}
                        </p>
                      </div>

                      {/* Price */}
                      <div className="shrink-0 text-right">
                        <span className="text-sm font-extrabold text-zinc-900">{t.basicPlanPrice}</span>
                      </div>
                    </motion.div>

                    {/* Standard Plan (Recommended) */}
                    <motion.div
                      variants={itemVariants}
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.985 }}
                      onClick={() => setSelectedPlan('standard')}
                      className={`p-4 border-2 rounded-[1.5rem] flex items-center gap-4 cursor-pointer transition-all duration-300 relative ${
                        selectedPlan === 'standard'
                          ? 'border-zinc-950 bg-zinc-50/30 shadow-[0_4px_20px_rgba(0,0,0,0.05)]'
                          : 'border-zinc-200 hover:border-zinc-300 bg-white hover:bg-zinc-50/20'
                      }`}
                    >
                      {/* Radio button style indicator */}
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-300 ${
                        selectedPlan === 'standard' ? 'border-zinc-950 bg-zinc-950' : 'border-zinc-300 bg-white'
                      }`}>
                        {selectedPlan === 'standard' && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white animate-scale-in" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-zinc-900 uppercase tracking-wider">{t.standardPlanName}</span>
                          <span className="text-[8px] font-bold px-2 py-0.5 rounded-full bg-zinc-900 text-white uppercase tracking-widest leading-none">
                            {t.recommended}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-500 mt-0.5 leading-tight">
                          {t.standardPlanDesc}
                        </p>
                      </div>

                      {/* Price */}
                      <div className="shrink-0 text-right">
                        <span className="text-sm font-extrabold text-zinc-900">{t.standardPlanPrice}</span>
                      </div>
                    </motion.div>

                    {/* Pro Plan */}
                    <motion.div
                      variants={itemVariants}
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.985 }}
                      onClick={() => setSelectedPlan('pro')}
                      className={`p-4 border-2 rounded-[1.5rem] flex items-center gap-4 cursor-pointer transition-all duration-300 relative ${
                        selectedPlan === 'pro'
                          ? 'border-zinc-950 bg-zinc-50/30 shadow-[0_4px_20px_rgba(0,0,0,0.05)]'
                          : 'border-zinc-200 hover:border-zinc-300 bg-white hover:bg-zinc-50/20'
                      }`}
                    >
                      {/* Radio button style indicator */}
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-300 ${
                        selectedPlan === 'pro' ? 'border-zinc-950 bg-zinc-950' : 'border-zinc-300 bg-white'
                      }`}>
                        {selectedPlan === 'pro' && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white animate-scale-in" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-zinc-900 uppercase tracking-wider">{t.proPlanName}</span>
                        </div>
                        <p className="text-[11px] text-zinc-500 mt-0.5 leading-tight">
                          {t.proPlanDesc}
                        </p>
                      </div>

                      {/* Price */}
                      <div className="shrink-0 text-right">
                        <span className="text-sm font-extrabold text-zinc-900">{t.proPlanPrice}</span>
                      </div>
                    </motion.div>
                  </div>

                  {/* Proceed Button */}
                  <motion.div variants={itemVariants} className="pt-2">
                    <motion.div 
                      whileHover={{ scale: 1.025 }}
                      whileTap={{ scale: 0.96 }}
                      className="relative group w-full h-[52px] flex items-center justify-center"
                    >
                      <div className="absolute -inset-[3px] rounded-full bg-[conic-gradient(from_0deg,#ffffff,#e4e4e7,#d4d4d8,#f4f4f5,#d4d4d8,#e4e4e7,#ffffff)] opacity-0 group-hover:opacity-100 blur-[6px] transition-all duration-500 pointer-events-none" />
                      <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,#ffffff,#e4e4e7,#d4d4d8,#f4f4f5,#d4d4d8,#e4e4e7,#ffffff)] opacity-100 transition-all duration-300 pointer-events-none" />
                      <button
                        type="button"
                        onClick={onLogin}
                        className="absolute inset-[2.5px] rounded-full bg-black flex items-center justify-center text-white shadow-[inset_0_2px_4px_rgba(255,255,255,0.15),inset_0_-2px_4px_rgba(0,0,0,0.8)] cursor-pointer font-bold text-xs uppercase tracking-wider"
                      >
                        <span className="mr-2">{t.continueToLibrary}</span>
                        <ArrowRight className="w-4 h-4 text-white" />
                      </button>
                    </motion.div>
                  </motion.div>
                </div>

                {/* Footer Back Link */}
                <motion.div variants={itemVariants} className="text-center text-xs text-gray-500 mt-6 relative z-10 select-none">
                  <button 
                    onClick={() => setMode('signup')}
                    className="font-bold text-zinc-900 hover:text-black underline decoration-zinc-300 hover:decoration-black transition-colors cursor-pointer"
                  >
                    ← {t.backToRegister}
                  </button>
                </motion.div>
              </motion.div>
            )}

          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}
