// resources/js/Pages/Welcome.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { useForm, usePage, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  Building2, 
  Phone, 
  Shield, 
  ArrowRight,
  CheckCircle,
  Users,
  Briefcase
} from 'lucide-react';

const InputField = ({
  label,
  type = 'text',
  value,
  onChange,
  showToggle = false,
  show = false,
  onToggle = () => {},
  name,
  autoComplete,
  placeholder,
  error,
  icon: Icon,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-2"
  >
    {label && (
      <label className="text-sm font-medium text-white/90" htmlFor={name}>
        {label}
      </label>
    )}
    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-blue-300" />
        </div>
      )}
      <input
        id={name}
        name={name}
        type={showToggle ? (show ? 'text' : 'password') : type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-4 rounded-2xl border-2 border-white/30 bg-white/15 backdrop-blur-sm text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all font-medium ${
          error ? 'border-red-300' : ''
        }`}
      />
      {showToggle && (
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white transition-colors"
          aria-label={show ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
        >
          {show ? <Eye size={20} /> : <EyeOff size={20} />}
        </button>
      )}
    </div>
    {error && (
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-sm text-red-300"
      >
        {error}
      </motion.p>
    )}
  </motion.div>
);

export default function Welcome() {
  // Apply saved theme (dark/light)
  useEffect(() => {
    const stored = localStorage.getItem('parkx-theme');
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    const next = stored || (prefersDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', next === 'dark');
  }, []);

  const [activeTab, setActiveTab] = useState('parkx'); // 'parkx' | 'contractor'
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirm, setShowSignupConfirm] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [bannerMessage, setBannerMessage] = useState('');

  const { props } = usePage();
  const flashMessage = props?.flash?.message || props?.flash?.success || props?.flash?.info;
  const projects = props?.projects || [];
  
  // Debug logging
  console.log('Welcome page - Projects received:', projects);
  console.log('Welcome page - Projects count:', projects.length);

  // Forms
  const loginForm = useForm({ email: '', password: '' });
  const signupForm = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone: '',
    company_name: '',
    role: '',
    project_id: '',
  });

  // Handle query params for banners & tab selection (after reset/forgot flows)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const resetLink = params.get('reset_link');          // 'sent'
    const resetDone = params.get('reset_done');          // 'parkx' | 'contractor'
    const tab = params.get('tab');                       // 'contractor'
    const type = params.get('type');                     // 'parkx' | 'contractor'

    if (tab === 'contractor' || type === 'contractor') setActiveTab('contractor');

    if (resetLink === 'sent') {
      setBannerMessage('Le lien de réinitialisation a été envoyé à votre adresse e-mail.');
    } else if (resetDone) {
      setBannerMessage('Votre mot de passe a été mis à jour. Vous pouvez maintenant vous connecter.');
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    const payload = {
      email: loginForm.data.email,
      password: loginForm.data.password,
      type: activeTab, // 'parkx' or 'contractor'
    };
    router.post('/login', payload, {
      onSuccess: () => {
        if (activeTab === 'contractor') router.visit('/contractant');
        else router.visit('/dashboard');
      },
      preserveScroll: true,
    });
  };

  const handleSignup = (e) => {
    e.preventDefault();
    signupForm.post('/contractor/register', {
      onSuccess: () => {
        signupForm.reset();
        setShowSignup(false);
        setActiveTab('contractor');
      },
      preserveScroll: true,
    });
  };

  // Forgot-password link per tab
  const forgotHref =
    activeTab === 'contractor'
      ? route('contractant.password.request')
      : route('password.request');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.8,
        ease: "backOut"
      }
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Enhanced Background with Industrial Campus Image */}
      <div className="absolute inset-0 -z-10">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat animate-pan"
          style={{ 
            backgroundImage: "url('/images/background_cp.jpeg')",
            willChange: 'transform'
          }}
        />
        
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-blue-900/40 to-indigo-900/60" />
        
        {/* Subtle Animated Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating Orbs - More subtle */}
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" />
          
          {/* Moving Particles - More subtle */}
          <div className="absolute inset-0">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white/10 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.1, 0.4, 0.1],
                }}
                transition={{
                  duration: 4 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative flex min-h-screen items-center justify-center px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-6xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left Hero Section */}
            <motion.div
              variants={cardVariants}
              className="text-center lg:text-left"
            >
              <div className="text-white drop-shadow-2xl">
                <motion.div
                  variants={iconVariants}
                  className="inline-flex items-center gap-3 mb-6"
                >
                  <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                    <Shield className="w-12 h-12 text-white" />
                  </div>
                  <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                    HSE ParkX
                  </h1>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mb-8"
                >
                  <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">QUI SOMMES NOUS</h2>
                  <p className="text-lg lg:text-xl text-blue-100 leading-relaxed">
                    Park X, filiale d'INNOVX, a pour mission de concevoir, développer, aménager et gérer des parcs industriels de nouvelle génération, conçus pour accueillir et dynamiser les activités stratégiques et les écosystèmes innovants portés par INNOVX.
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-wrap gap-4 justify-center lg:justify-start"
                >
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-sm font-medium">Parcs industriels nouvelle génération</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl">
                    <Users className="w-5 h-5 text-blue-400" />
                    <span className="text-sm font-medium">Écosystèmes innovants</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl">
                    <Briefcase className="w-5 h-5 text-purple-400" />
                    <span className="text-sm font-medium">Activités stratégiques</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Right Login Panel */}
            <motion.div
              variants={cardVariants}
              className="flex justify-center lg:justify-end"
            >
              <div className="w-full max-w-lg">
                <div className="rounded-3xl bg-white/15 backdrop-blur-2xl border-2 border-white/30 shadow-2xl ring-2 ring-white/20 p-8 sm:p-10">
                  {/* Logo + Heading */}
                  <motion.div
                    variants={iconVariants}
                    className="text-center mb-8"
                  >
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <img src="/images/logo.png" alt="logo" className="h-12 w-auto" />
                      <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                        <Shield className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">Connexion</h2>
                    <p className="text-blue-200">
                      Connectez-vous en tant qu'utilisateur ou contractant
                    </p>
                  </motion.div>

                  {/* Tabs */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex bg-white/20 backdrop-blur-sm rounded-2xl p-1 mb-6 border border-white/30"
                    role="tablist"
                    aria-label="Type de compte"
                  >
                    <button
                      role="tab"
                      aria-selected={activeTab === 'parkx'}
                      className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all ${
                        activeTab === 'parkx'
                          ? 'bg-white/30 text-white shadow-lg'
                          : 'text-blue-200 hover:text-white hover:bg-white/10'
                      }`}
                      onClick={() => { setActiveTab('parkx'); setShowSignup(false); }}
                    >
                      ParkX
                    </button>
                    <button
                      role="tab"
                      aria-selected={activeTab === 'contractor'}
                      className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all ${
                        activeTab === 'contractor'
                          ? 'bg-white/30 text-white shadow-lg'
                          : 'text-blue-200 hover:text-white hover:bg-white/10'
                      }`}
                      onClick={() => setActiveTab('contractor')}
                    >
                      Contractant
                    </button>
                  </motion.div>

                  {/* Banners */}
                  {bannerMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-4 px-4 py-3 text-emerald-100 bg-emerald-500/20 backdrop-blur-sm border border-emerald-300/30 rounded-2xl text-center"
                    >
                      {bannerMessage}
                    </motion.div>
                  )}
                  {flashMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-4 px-4 py-3 text-emerald-100 bg-emerald-500/20 backdrop-blur-sm border border-emerald-300/30 rounded-2xl text-center"
                    >
                      {flashMessage}
                    </motion.div>
                  )}

                  {/* Forms area */}
                  <div className="space-y-6">
                    {!showSignup ? (
                      // LOGIN
                      <motion.form
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        onSubmit={handleLogin}
                        className="space-y-6"
                      >
                        <InputField
                          label="Adresse e-mail"
                          type="email"
                          name="email"
                          value={loginForm.data.email}
                          onChange={(val) => loginForm.setData('email', val)}
                          autoComplete="username"
                          placeholder="exemple@mail.com"
                          error={loginForm.errors?.email}
                          icon={Mail}
                        />
                        <InputField
                          label="Mot de passe"
                          name="password"
                          value={loginForm.data.password}
                          onChange={(val) => loginForm.setData('password', val)}
                          showToggle
                          show={showLoginPassword}
                          onToggle={() => setShowLoginPassword((s) => !s)}
                          autoComplete="current-password"
                          placeholder="••••••••"
                          error={loginForm.errors?.password}
                          icon={Lock}
                        />
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="submit"
                          disabled={loginForm.processing}
                          className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold transition-all hover:from-orange-600 hover:to-red-600 disabled:opacity-70 shadow-xl hover:shadow-2xl flex items-center justify-center gap-2 text-lg"
                        >
                          {loginForm.processing ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Connexion…
                            </>
                          ) : (
                            <>
                              Se connecter
                              <ArrowRight className="w-5 h-5" />
                            </>
                          )}
                        </motion.button>

                        {/* Forgot password link per tab */}
                        <div className="text-center">
                          <a
                            href={forgotHref}
                            className="text-sm text-blue-200 hover:text-white transition-colors underline-offset-2 hover:underline"
                          >
                            Mot de passe oublié ?
                          </a>
                        </div>

                        {loginForm.errors?.type && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-sm text-red-300 text-center"
                          >
                            {loginForm.errors.type}
                          </motion.p>
                        )}
                      </motion.form>
                    ) : (
                      // SIGNUP (scrollable area)
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="max-h-[400px] overflow-y-auto custom-scrollbar pr-2 -mr-2"
                      >
                        <form onSubmit={handleSignup} className="space-y-4">
                          <InputField
                            label="Nom complet"
                            name="name"
                            value={signupForm.data.name}
                            onChange={(val) => signupForm.setData('name', val)}
                            autoComplete="name"
                            placeholder="Nom prenom"
                            error={signupForm.errors?.name}
                            icon={User}
                          />
                          <InputField
                            label="Email"
                            type="email"
                            name="email"
                            value={signupForm.data.email}
                            onChange={(val) => signupForm.setData('email', val)}
                            autoComplete="email"
                            placeholder="exemple@mail.com"
                            error={signupForm.errors?.email}
                            icon={Mail}
                          />
                          <InputField
                            label="Mot de passe"
                            name="password"
                            value={signupForm.data.password}
                            onChange={(val) => signupForm.setData('password', val)}
                            showToggle
                            show={showSignupPassword}
                            onToggle={() => setShowSignupPassword((s) => !s)}
                            autoComplete="new-password"
                            placeholder="••••••••"
                            error={signupForm.errors?.password}
                            icon={Lock}
                          />
                          <InputField
                            label="Confirmer le mot de passe"
                            name="password_confirmation"
                            value={signupForm.data.password_confirmation}
                            onChange={(val) => signupForm.setData('password_confirmation', val)}
                            showToggle
                            show={showSignupConfirm}
                            onToggle={() => setShowSignupConfirm((s) => !s)}
                            autoComplete="new-password"
                            placeholder="••••••••"
                            error={signupForm.errors?.password_confirmation}
                            icon={Lock}
                          />
                          <InputField
                            label="Téléphone"
                            name="phone"
                            value={signupForm.data.phone}
                            onChange={(val) => signupForm.setData('phone', val)}
                            autoComplete="tel"
                            placeholder="+212 6 12 34 56 78"
                            error={signupForm.errors?.phone}
                            icon={Phone}
                          />
                          <InputField
                            label="Entreprise"
                            name="company_name"
                            value={signupForm.data.company_name}
                            onChange={(val) => signupForm.setData('company_name', val)}
                            placeholder="Votre société"
                            error={signupForm.errors?.company_name}
                            icon={Building2}
                          />
                          <div>
                            <label className="text-sm font-medium text-white/90">
                              Rôle
                            </label>
                            <select
                              value={signupForm.data.role}
                              onChange={(e) => signupForm.setData('role', e.target.value)}
                              className="mt-2 w-full px-4 py-4 bg-white/15 backdrop-blur-sm border-2 border-white/30 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all font-medium"
                            >
                              <option value="" className="bg-slate-800">Sélectionner un rôle</option>
                              <option value="manager" className="bg-slate-800">Manager</option>
                              <option value="supervisor" className="bg-slate-800">Superviseur</option>
                              <option value="worker" className="bg-slate-800">Ouvrier</option>
                            </select>
                            {signupForm.errors?.role && (
                              <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-sm text-red-300 mt-1"
                              >
                                {signupForm.errors.role}
                              </motion.p>
                            )}
                          </div>
                          <div>
                            <label className="text-sm font-medium text-white/90">
                              Projet
                            </label>
                            <select
                              value={signupForm.data.project_id}
                              onChange={(e) => signupForm.setData('project_id', e.target.value)}
                              className="mt-2 w-full px-4 py-4 bg-white/15 backdrop-blur-sm border-2 border-white/30 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all font-medium"
                            >
                              <option value="" className="bg-slate-800">Sélectionner un projet</option>
                              {projects.length > 0 ? (
                                projects.map((project) => (
                                  <option key={project.id} value={project.id} className="bg-slate-800">
                                    {project.name} - {project.site?.name || 'Site non spécifié'}
                                  </option>
                                ))
                              ) : (
                                <option value="" className="bg-slate-800" disabled>Aucun projet disponible</option>
                              )}
                            </select>
                            {signupForm.errors?.project_id && (
                              <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-sm text-red-300 mt-1"
                              >
                                {signupForm.errors.project_id}
                              </motion.p>
                            )}
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={signupForm.processing}
                            className="w-full py-4 rounded-2xl bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold transition-all hover:from-yellow-600 hover:to-orange-600 disabled:opacity-70 shadow-xl hover:shadow-2xl flex items-center justify-center gap-2 text-lg"
                          >
                            {signupForm.processing ? (
                              <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Envoi…
                              </>
                            ) : (
                              <>
                                Demander un accès
                                <ArrowRight className="w-5 h-5" />
                              </>
                            )}
                          </motion.button>
                        </form>
                      </motion.div>
                    )}
                  </div>

                  {/* Toggle link */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6 text-center text-sm"
                  >
                    {showSignup ? (
                      <>
                        Déjà inscrit ?{' '}
                        <button onClick={() => setShowSignup(false)} className="text-blue-200 hover:text-white hover:underline transition-colors">
                          Se connecter
                        </button>
                      </>
                    ) : (
                      activeTab === 'contractor' && (
                        <>
                          Pas encore de compte ?{' '}
                          <button onClick={() => setShowSignup(true)} className="text-blue-200 hover:text-white hover:underline transition-colors">
                            Créer un compte
                          </button>
                        </>
                      )
                    )}
                  </motion.div>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-xs text-blue-200 text-center mt-4"
                  >
                    Park X — Filiale d'INNOVX • Parcs Industriels de Nouvelle Génération
                  </motion.p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Styles */}
      <style>{`
        @keyframes pan {
          0%   { transform: scale(1.02) translate(0%, 0%); }
          50%  { transform: scale(1.05) translate(-1%, -0.5%); }
          100% { transform: scale(1.02) translate(-2%, -1%); }
        }
        .animate-pan { 
          animation: pan 30s ease-in-out infinite alternate; 
          transform-origin: center; 
        }
        @media (prefers-reduced-motion: reduce) { 
          .animate-pan { animation: none !important; } 
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
}