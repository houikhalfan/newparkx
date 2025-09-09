// resources/js/Pages/Admin/Signatures/Show.jsx
import React from "react";
import { useForm, usePage, Link } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";

function AdminSignShow() {
  const { req, csrf_token, users = [] } = usePage().props;

  // Only keep "assign" for admin
  const assignForm = useForm({ user_id: "" });
  const assign = (e) => {
    e.preventDefault();
    assignForm.post(route("admin.signatures.assign", req.id));
  };

  return (
    <div className="-m-4 md:-m-8 bg-white min-h-[calc(100vh-3.5rem)] p-4 md:p-8">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Demande de signature</h1>
      </div>

      <div className="card-frame">
        {/* Card header */}
        <div className="flex items-start justify-between gap-6 border-b p-6">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <h2 className="truncate text-xl md:text-2xl font-semibold tracking-tight">{req.title}</h2>
              <StatusBadge s={req.status} />
            </div>

            {req.message && <p className="mt-2 text-gray-700">{req.message}</p>}

            <div className="mt-3 text-sm text-gray-600">
              <span className="font-medium">Contractant</span>&nbsp;:&nbsp;
              <span className="font-medium">{req.contractor?.name}</span>{" "}
              <span className="text-gray-500">({req.contractor?.email})</span>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              {req.original_path && (
                <a
                  className="inline-flex items-center rounded-lg border px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  href={route("admin.signatures.download.original", req.id)}
                >
                  Télécharger l’original
                </a>
              )}

              {/* Make the signed badge a download link */}
              {req.signed_path && (
                <a
                  className="inline-flex items-center rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-700 ring-1 ring-inset ring-green-200 hover:bg-green-100"
                  href={route("admin.signatures.download.signed", req.id)}
                >
                  Document signé
                </a>
              )}
            </div>
          </div>

       
        </div>

        {/* Card body – no approve/refuse forms anymore */}
        <div className="p-6">
          

          {/* Comments / history */}
          <section className="mt-8">
            <h3 className="text-base font-semibold">Commentaires</h3>

            {req.request_comments?.length ? (
              <ul className="mt-3 space-y-3">
                {req.request_comments.map((c) => (
                  <li key={c.id} className="rounded-xl border bg-gray-50 p-4">
                    <div className="mb-1 flex items-center justify-between text-xs text-gray-500">
                      <span className="inline-flex items-center gap-2">
                        <span
                          className={`h-2 w-2 rounded-full ${
                            c.author_type?.includes("Admin") ? "bg-gray-900" : "bg-blue-600"
                          }`}
                        />
                        {c.author_type?.includes("Admin") ? "Admin" : "Contractant"}
                      </span>
                      <span>
                        {new Date(c.created_at).toLocaleString("fr-FR", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </span>
                    </div>
                    <div className="text-sm text-gray-800">{c.body}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-gray-500">Aucun commentaire.</p>
            )}
          </section>
        </div>
      </div>

      <div className="mt-4">
        <Link href={route("admin.signatures.index")} className="text-sm text-gray-600 hover:underline">
          ← Retour aux demandes
        </Link>
      </div>

      <style>{`
        .card-frame {
          background-color: #ffffff;
          border: 1px solid rgba(0,0,0,0.08);
          border-radius: 20px;
          box-shadow:
            0 1px 0 rgba(0,0,0,0.04),
            0 8px 24px -12px rgba(0,0,0,0.18);
        }
      `}</style>
    </div>
  );
}

function StatusBadge({ s }) {
  const map = {
    submitted: { bg: "bg-blue-50", text: "text-blue-700", ring: "ring-blue-200", label: "Soumise" },
    assigned:  { bg: "bg-amber-50", text: "text-amber-700", ring: "ring-amber-200", label: "Assignée" },
    signed:    { bg: "bg-green-50", text: "text-green-700", ring: "ring-green-200", label: "Signée" },
    rejected:  { bg: "bg-red-50", text: "text-red-700", ring: "ring-red-200", label: "Rejetée" },
    pending:   { bg: "bg-gray-100", text: "text-gray-700", ring: "ring-gray-200", label: "En attente" },
  };
  const m = map[s] || { bg: "bg-gray-100", text: "text-gray-700", ring: "ring-gray-200", label: s || "—" };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${m.bg} ${m.text} ${m.ring}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current/70" />
      {m.label}
    </span>
  );
}

AdminSignShow.layout = (page) => <AdminLayout>{page}</AdminLayout>;
export default AdminSignShow;
