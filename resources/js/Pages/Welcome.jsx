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
    className="space-y-1"
  >
    {label && (
      <label className="text-sm text-gray-700 font-medium" htmlFor={name}>
        {label}
      </label>
    )}
    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-blue-500" />
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
        className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-3 bg-white border border-gray-300
                    rounded-lg text-gray-900 placeholder-gray-500
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      error ? 'border-red-500' : ''
                    }`}
      />
      {showToggle && (
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          aria-label={show ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
        >
          {show ? <Eye size={18} /> : <EyeOff size={18} />}
        </button>
      )}
    </div>
    {error && (
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-xs text-red-600"
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

  // Background image (full page)
  const backgroundImages = useMemo(() => ['/images/background_admin.jpeg', '/images/background_admin.jpeg'], []);
  const backgroundImage = useMemo(
    () => backgroundImages[Math.floor(Math.random() * backgroundImages.length)],
    [backgroundImages]
  );

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
      {/* FULL-PAGE BACKGROUND IMAGE */}
      <img
        src={backgroundImage}
        alt="HSE ParkX background"
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
      />
      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-black/45" />

      {/* FOREGROUND CONTENT */}
      <div className="relative z-10 min-h-screen flex">
        {/* Left hero text (desktop) */}
        <motion.div 
          variants={cardVariants}
          className="hidden md:flex flex-1 items-center justify-center text-center px-6"
        >
          <div className="text-white drop-shadow-md max-w-2xl">
           <motion.h1 
  variants={iconVariants}
  className="text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight text-white drop-shadow-lg font-sans"
>
  Bienvenue sur HSE ParkX
</motion.h1>

<motion.p 
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.3 }}
  className="text-lg lg:text-xl leading-relaxed text-white mb-8 font-light"
>
  ParkX, filiale d'INNOVX, a pour mission de concevoir, développer, aménager et gérer des parcs industriels de nouvelle génération, conçus pour accueillir et dynamiser les activités stratégiques et les écosystèmes innovants portés par INNOVX.
</motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-4 justify-center"
            >
              <div className="flex items-center gap-2 px-4 py-2 bg-black/60 rounded-xl border border-white/30">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span className="text-sm font-medium text-white">Parcs industriels nouvelle génération</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-black/60 rounded-xl border border-white/30">
                <Users className="w-5 h-5 text-blue-300" />
                <span className="text-sm font-medium text-white">Écosystèmes innovants</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-black/60 rounded-xl border border-white/30">
                <Briefcase className="w-5 h-5 text-purple-300" />
                <span className="text-sm font-medium text-white">Activités stratégiques</span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* RIGHT AUTH PANEL */}
        <motion.div
          variants={cardVariants}
          className="w-full md:w-[480px] lg:w-[520px] ml-auto flex items-center justify-center p-5 md:p-8"
        >
          <div className="w-full max-w-md">
            {/* White card */}
            <div className="bg-white rounded-2xl shadow-2xl p-6 flex flex-col min-h-[540px] max-h-[84vh]">
              {/* Logo + Heading */}
              <motion.div
                variants={iconVariants}
                className="mb-5 text-center"
              >
                <img src="/images/logo.png" alt="logo" className="mx-auto h-12 w-auto mb-3" />
                <h2 className="text-2xl font-bold mb-1 text-gray-900">Connexion</h2>
                <p className="text-gray-600 text-sm">
                  Connectez-vous en tant qu'utilisateur ou contractant
                </p>
              </motion.div>

              {/* Tabs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex bg-gray-100 rounded-lg p-1 mb-4"
                role="tablist"
                aria-label="Type de compte"
              >
                <button
                  role="tab"
                  aria-selected={activeTab === 'parkx'}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
                    activeTab === 'parkx'
                      ? 'bg-white text-gray-900 shadow'
                      : 'text-gray-700'
                  }`}
                  onClick={() => { setActiveTab('parkx'); setShowSignup(false); }}
                >
                  ParkX
                </button>
                <button
                  role="tab"
                  aria-selected={activeTab === 'contractor'}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
                    activeTab === 'contractor'
                      ? 'bg-white text-gray-900 shadow'
                      : 'text-gray-700'
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
                  className="mb-3 px-4 py-2 text-green-900 bg-emerald-100 border border-emerald-200 rounded text-center"
                >
                  {bannerMessage}
                </motion.div>
              )}
              {flashMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-3 px-4 py-2 text-green-900 bg-emerald-100 border border-emerald-200 rounded text-center"
                >
                  {flashMessage}
                </motion.div>
              )}

              {/* Forms area */}
              <div className="flex-1 overflow-hidden">
                {!showSignup ? (
                  // LOGIN
                  <motion.form
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    onSubmit={handleLogin}
                    className="space-y-4"
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
                      className="w-full py-3 rounded-lg bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {loginForm.processing ? 'Connexion…' : 'Se connecter'}
                    </motion.button>

                    {/* Forgot password link per tab */}
                    <div className="text-center mt-2">
                      <a
                        href={forgotHref}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Mot de passe oublié ?
                      </a>
                    </div>

                    {loginForm.errors?.type && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-red-600 text-center mt-2"
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
                    className="max-h-[320px] overflow-y-auto custom-scrollbar pr-2 -mr-2"
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
                        <label className="text-sm text-gray-700 font-medium">
                          Rôle
                        </label>
                        <select
                          value={signupForm.data.role}
                          onChange={(e) => signupForm.setData('role', e.target.value)}
                          className="mt-1 w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Sélectionner un rôle</option>
                          <option value="manager">Manager</option>
                          <option value="supervisor">Superviseur</option>
                          <option value="worker">Ouvrier</option>
                        </select>
                        {signupForm.errors?.role && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-xs text-red-600 mt-1"
                          >
                            {signupForm.errors.role}
                          </motion.p>
                        )}
                      </div>
                      <div>
                        <label className="text-sm text-gray-700 font-medium">
                          Projet
                        </label>
                        <select
                          value={signupForm.data.project_id}
                          onChange={(e) => signupForm.setData('project_id', e.target.value)}
                          className="mt-1 w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Sélectionner un projet</option>
                          {projects.length > 0 ? (
                            projects.map((project) => (
                              <option key={project.id} value={project.id}>
                                {project.name} - {project.site?.name || 'Site non spécifié'}
                              </option>
                            ))
                          ) : (
                            <option value="" disabled>Aucun projet disponible</option>
                          )}
                        </select>
                        {signupForm.errors?.project_id && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-xs text-red-600 mt-1"
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
                        className="w-full py-3 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {signupForm.processing ? 'Envoi…' : 'Demander un accès'}
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
                className="mt-4 text-center text-sm"
              >
                {showSignup ? (
                  <>
                    Déjà inscrit ?{' '}
                    <button onClick={() => setShowSignup(false)} className="text-blue-600 hover:underline">
                      Se connecter
                    </button>
                  </>
                ) : (
                  activeTab === 'contractor' && (
                    <>
                      Pas encore de compte ?{' '}
                      <button onClick={() => setShowSignup(true)} className="text-blue-600 hover:underline">
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
                className="text-xs text-gray-400 text-center mt-2"
              >
                ParkX — Parcs Industriels Durables.
              </motion.p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
}