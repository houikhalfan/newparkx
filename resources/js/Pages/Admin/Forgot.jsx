import { useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Mail, 
  ArrowLeft, 
  Send,
  Crown
} from 'lucide-react';

export default function AdminForgot() {
  const { data, setData, post, processing, errors, reset } = useForm({
    email: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('admin.password.email'), {
      onSuccess: () => {
        // Nettoie l'input puis redirige vers /admin/login avec un flag
        reset('email');
        window.location.href = route('admin.login') + '?reset_link=sent';
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
      {/* Enhanced Background with Admin Background Image */}
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
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-purple-900/40 to-indigo-900/60" />
        
        {/* Subtle Animated Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating Orbs - More subtle */}
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-indigo-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse" />
          
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
                <div className="flex items-center gap-3 mb-4">
                  <img src="/images/logo.png" alt="Company logo" className="h-12 w-auto" />
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl">
                    <Crown className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Réinitialiser le mot de passe</h1>
                <p className="text-blue-200 text-center">
                  Admin - Entrez votre adresse e-mail d'administrateur pour recevoir un lien de réinitialisation
                </p>
              </motion.div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-white">Adresse e-mail</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-blue-300" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      placeholder="admin@entreprise.com"
                      value={data.email}
                      onChange={(e) => setData('email', e.target.value)}
                      aria-invalid={!!errors.email}
                      className="w-full pl-10 pr-4 py-4 rounded-2xl border-2 border-white/30 bg-white/15 backdrop-blur-sm text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all font-medium"
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

                {/* Submit Button */}
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={processing}
                  className="w-full rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-4 font-semibold transition-all hover:from-purple-600 hover:to-indigo-700 disabled:opacity-70 shadow-xl hover:shadow-2xl flex items-center justify-center gap-2 text-lg"
                >
                  {processing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Envoi…
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Envoyer le lien
                    </>
                  )}
                </motion.button>
              </form>

              {/* Back to Login */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-6 text-center"
              >
                <a
                  href={route('admin.login')}
                  className="inline-flex items-center gap-2 text-sm text-blue-200 hover:text-white transition-colors underline-offset-2 hover:underline"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Retour à la connexion
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