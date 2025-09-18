import { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Shield, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function AdminLogin() {
  const { data, setData, post, errors, processing } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  const [banner, setBanner] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('reset_link') === 'sent') {
      setBanner('Le lien de réinitialisation a été envoyé à votre adresse e-mail.');
    }
    
    // Debug: Check if background image loads
    const img = new Image();
    img.onload = () => console.log('Background image loaded successfully');
    img.onerror = () => console.log('Background image failed to load - check if file exists at /images/background_admin.jpeg');
    img.src = '/images/background_admin.jpeg';
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/admin/login', {
      onSuccess: () => {
        window.location.href = '/admin';
      },
    });
  };

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
      {/* Background with Image */}
      <div className="absolute inset-0 -z-10">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat animate-pan"
          style={{ 
            backgroundImage: "url('/images/background_admin.jpeg')",
            willChange: 'transform'
          }}
        />
        
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40" />
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
          className="w-full max-w-lg"
        >
          <motion.div
            variants={cardVariants}
            className="relative"
          >
            <div className="w-full rounded-3xl bg-white/15 backdrop-blur-2xl border-2 border-white/30 shadow-2xl ring-2 ring-white/20 p-8 sm:p-10 min-w-[400px] max-w-[500px]">
              {/* Logo Section */}
              <motion.div
                variants={iconVariants}
                className="flex flex-col items-center mb-8"
              >
               
                <img 
                  src="/images/logo.png" 
                  alt="Company logo" 
                  className="h-16 w-auto mb-2" 
                  draggable="false" 
                />
                <h1 className="text-2xl font-bold text-white mb-2">Administration</h1>
                <p className="text-blue-100 text-center">
                  Connectez-vous à votre tableau de bord administrateur
                </p>
              </motion.div>

              {/* Success Banner */}
              {banner && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 rounded-2xl border border-emerald-300/50 bg-emerald-500/20 backdrop-blur-sm px-4 py-3 text-sm text-emerald-100"
                >
                  {banner}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-white">
                    Adresse e-mail
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-blue-300" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      autoComplete="username"
                      placeholder="admin@entreprise.com"
                      value={data.email}
                      onChange={(e) => setData('email', e.target.value)}
                      aria-invalid={!!errors.email}
                      className="w-full pl-10 pr-4 py-4 rounded-2xl border-2 border-white/30 bg-white/15 backdrop-blur-sm text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all font-medium"
                      required
                    />
                  </div>
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-2 text-sm text-red-300"
                    >
                      {errors.email}
                    </motion.p>
                  )}
                </motion.div>

                {/* Password Field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <label htmlFor="password" className="mb-2 block text-sm font-medium text-white">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-blue-300" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      value={data.password}
                      onChange={(e) => setData('password', e.target.value)}
                      aria-invalid={!!errors.password}
                      className="w-full pl-10 pr-12 py-4 rounded-2xl border-2 border-white/30 bg-white/15 backdrop-blur-sm text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all font-medium"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-blue-300 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-2 text-sm text-red-300"
                    >
                      {errors.password}
                    </motion.p>
                  )}
                </motion.div>

                {/* Remember Me */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center gap-3"
                >
                  <input
                    id="remember"
                    type="checkbox"
                    checked={data.remember}
                    onChange={(e) => setData('remember', e.target.checked)}
                    className="h-4 w-4 rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-400 focus:ring-offset-0"
                  />
                  <label htmlFor="remember" className="select-none text-sm text-blue-100">
                    Se souvenir de moi
                  </label>
                </motion.div>

                {/* Submit Button */}
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={processing}
                  className="w-full rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 font-semibold transition-all hover:from-blue-600 hover:to-indigo-700 disabled:opacity-70 shadow-xl hover:shadow-2xl flex items-center justify-center gap-2 text-lg"
                >
                  {processing ? (
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
              </form>

              {/* Forgot Password */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-6 text-center"
              >
                <a
                  href={route('admin.password.request')}
                  className="text-sm text-blue-200 underline-offset-2 hover:text-white transition-colors"
                >
                  Mot de passe oublié ?
                </a>
              </motion.div>
            </div>
          </motion.div>
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
      `}</style>
    </div>
  );
}