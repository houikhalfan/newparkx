import { useForm } from '@inertiajs/react';

export default function ContractorForgot() {
  const { data, setData, post, processing, errors } = useForm({ email: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('contractant.password.email'), {
      // Backend already redirects to /login?tab=contractor&reset_link=sent
      preserveScroll: true,
    });
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* same animated bg as login */}
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
              <img src="/images/logo.png" alt="ParkX" className="h-12 w-auto mb-4" draggable="false" />
            </div>

            <h1 className="text-xl font-semibold text-center">Réinitialiser le mot de passe (Contractant)</h1>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-800">Adresse e-mail</label>
                <input
                  id="email"
                  type="email"
                  value={data.email}
                  onChange={e => setData('email', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white/90 px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                  placeholder="contact@entreprise.com"
                  required
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              <button
                type="submit"
                disabled={processing}
                className="w-full rounded-lg bg-black text-white py-3 font-medium transition hover:opacity-90 disabled:opacity-70"
              >
                {processing ? 'Envoi…' : 'Envoyer le lien'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <a href={route('login')} className="text-sm text-gray-700 underline-offset-2 hover:text-gray-900">
                Retour à la connexion
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pan { 0%{transform:scale(1.08) translate(0,0)} 50%{transform:scale(1.12) translate(-2%,-1%)} 100%{transform:scale(1.08) translate(-4%,-3%)} }
        .animate-pan { animation: pan 36s ease-in-out infinite alternate; transform-origin:center; }
        @media (prefers-reduced-motion: reduce) { .animate-pan { animation: none !important; } }
      `}</style>
    </div>
  );
}
