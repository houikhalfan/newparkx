import { useForm, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { 
  Shield, 
  Mail, 
  Lock, 
  ArrowLeft, 
  CheckCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import Swal from 'sweetalert2';

export default function UserReset() {
  const { token, email: initialEmail } = usePage().props;
  const { data, setData, post, processing, errors } = useForm({
    token: token || '',
    email: initialEmail || '',
    password: '',
    password_confirmation: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const iconVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const submit = (e) => {
    e.preventDefault();
    post(route('password.update'), {
      onSuccess: () => {
        Swal.fire({
          icon: 'success',
          title: 'Mot de passe mis à jour',
          text: 'Vous pouvez maintenant vous connecter.',
          confirmButtonText: 'Aller à la connexion',
        }).then(() => {
          window.location.href = route('login') + '?reset_done=parkx';
        });
      },
      onError: () => {
        const msg = errors?.email || errors?.password || 'La mise à jour a échoué. Vérifiez le formulaire et réessayez.';
        Swal.fire({ icon: 'error', title: 'Erreur', text: msg, confirmButtonText: 'OK' });
      },
    });
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
          className="w-full max-w-md"
        >
          <motion.div
            variants={cardVariants}
            className="relative rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-8"
          >
            {/* Header with Logo and Shield */}
            <div className="text-center mb-8">
              <motion.div
                variants={iconVariants}
                className="flex items-center justify-center gap-3 mb-6"
              >
                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-white">PARKX</h1>
              </motion.div>
              
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xl font-semibold text-white mb-2"
              >
                Nouveau mot de passe
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-blue-200 text-sm"
              >
                Définissez votre nouveau mot de passe sécurisé
              </motion.p>
            </div>

            <form onSubmit={submit} className="space-y-6">
              <input type="hidden" value={data.token} />
              
              {/* Email Field */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-2"
              >
                <label className="text-sm font-medium text-white/90">Adresse e-mail</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-blue-300" />
                  </div>
                <input
                  type="email"
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                    className="w-full pl-10 pr-4 py-4 rounded-2xl border-2 border-white/30 bg-white/15 backdrop-blur-sm text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all font-medium"
                    placeholder="votre@email.com"
                  required
                />
              </div>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-red-300"
                  >
                    {errors.email}
                  </motion.p>
                )}
              </motion.div>

              {/* Password Field */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-2"
              >
                <label className="text-sm font-medium text-white/90">Mot de passe</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-blue-300" />
                  </div>
                <input
                    type={showPassword ? 'text' : 'password'}
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                    className="w-full pl-10 pr-12 py-4 rounded-2xl border-2 border-white/30 bg-white/15 backdrop-blur-sm text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all font-medium"
                    placeholder="Nouveau mot de passe"
                  required
                />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white transition-colors"
                    aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  >
                    {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-red-300"
                  >
                    {errors.password}
                  </motion.p>
                )}
              </motion.div>

              {/* Confirm Password Field */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="space-y-2"
              >
                <label className="text-sm font-medium text-white/90">Confirmer le mot de passe</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-blue-300" />
              </div>
                <input
                    type={showConfirmPassword ? 'text' : 'password'}
                  value={data.password_confirmation}
                  onChange={(e) => setData('password_confirmation', e.target.value)}
                    className="w-full pl-10 pr-12 py-4 rounded-2xl border-2 border-white/30 bg-white/15 backdrop-blur-sm text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all font-medium"
                    placeholder="Confirmer le mot de passe"
                  required
                />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white transition-colors"
                    aria-label={showConfirmPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  >
                    {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                  </button>
              </div>
                {errors.password_confirmation && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-red-300"
                  >
                    {errors.password_confirmation}
                  </motion.p>
                )}
              </motion.div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={processing}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
              >
                {processing ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Mise à jour...
                  </div>
                ) : (
                  'Mettre à jour'
                )}
              </motion.button>
            </form>

            {/* Back to Login Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="mt-6 text-center"
            >
              <a
                href={route('login')}
                className="inline-flex items-center gap-2 text-sm text-blue-200 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour à la connexion
              </a>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      <style>{`
        @keyframes pan { 
          0% { transform: scale(1.08) translate(0, 0) }
          50% { transform: scale(1.12) translate(-2%, -1%) }
          100% { transform: scale(1.08) translate(-4%, -3%) }
        }
        .animate-pan { 
          animation: pan 36s ease-in-out infinite alternate; 
          transform-origin: center; 
        }
        @media (prefers-reduced-motion: reduce) { 
          .animate-pan { animation: none !important; } 
        }
      `}</style>
    </div>
  );
}
