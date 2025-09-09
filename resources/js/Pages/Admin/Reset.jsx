import { useForm, usePage } from '@inertiajs/react';
import Swal from 'sweetalert2';

export default function AdminReset() {
  const { token, email: initialEmail } = usePage().props;

  const { data, setData, post, processing, errors } = useForm({
    token: token || '',
    email: initialEmail || '',
    password: '',
    password_confirmation: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('admin.password.update'), {
      onSuccess: () => {
        Swal.fire({
          icon: 'success',
          title: 'Mot de passe mis à jour',
          text: 'Vous pouvez maintenant vous connecter.',
          confirmButtonText: 'Aller à la connexion',
        }).then(() => {
          window.location.href = route('admin.login');
        });
      },
      onError: () => {
        const msg =
          errors?.email ||
          errors?.password ||
          'La mise à jour a échoué. Veuillez vérifier le formulaire et réessayer.';
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: msg,
          confirmButtonText: 'OK',
        });
      },
    });
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0 bg-center bg-cover animate-pan"
          style={{ backgroundImage: "url('/images/INNO.jpg')", willChange: 'transform' }}
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30" />
      </div>

      <div className="relative flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-xl">
          <div className="rounded-2xl bg-white/60 backdrop-blur-xl border border-white/20 shadow-2xl ring-1 ring-black/5 p-8 sm:p-10">
            <div className="flex justify-center">
              <img src="/images/logo.png" alt="Company logo" className="h-18 w-auto mb-4" draggable="false" />
            </div>

            <h1 className="text-center text-xl font-semibold text-gray-900">
              Nouveau mot de passe (Admin)
            </h1>
            <p className="mt-2 text-center text-gray-700">
              Choisissez un nouveau mot de passe pour votre compte administrateur.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <input type="hidden" value={data.token} />

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-800">Adresse e-mail</label>
                <input
                  type="email"
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white/90 px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                  required
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-800">Mot de passe</label>
                <input
                  type="password"
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white/90 px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                  required
                />
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-800">Confirmer le mot de passe</label>
                <input
                  type="password"
                  value={data.password_confirmation}
                  onChange={(e) => setData('password_confirmation', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white/90 px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={processing}
                className="w-full rounded-lg bg-black text-white py-3 font-medium transition hover:opacity-90 disabled:opacity-70"
              >
                {processing ? 'Mise à jour…' : 'Mettre à jour'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <a href={route('admin.login')} className="text-sm text-gray-700 underline-offset-2 hover:text-gray-900">
                Retour à la connexion
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pan {
          0%   { transform: scale(1.08) translate(0%, 0%); }
          50%  { transform: scale(1.12) translate(-2%, -1%); }
          100% { transform: scale(1.08) translate(-4%, -3%); }
        }
        .animate-pan { animation: pan 36s ease-in-out infinite alternate; transform-origin: center; }
        @media (prefers-reduced-motion: reduce) { .animate-pan { animation: none !important; } }
      `}</style>
    </div>
  );
}
