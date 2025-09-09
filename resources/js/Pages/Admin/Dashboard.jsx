// resources/js/Pages/Admin/Dashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import { usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import Swal from "sweetalert2";

/* --- small table helpers for consistent look --- */
function Th({ children, className = "" }) {
  return (
    <th className={`px-4 py-3 text-xs font-medium uppercase tracking-wide ${className}`}>
      {children}
    </th>
  );
}
function Td({ children, className = "" }) {
  return <td className={`px-4 py-3 align-middle ${className}`}>{children}</td>;
}
function FieldError({ id, children }) {
  if (!children) return null;
  return (
    <p id={id} className="mt-1 text-xs text-rose-600">
      {children}
    </p>
  );
}
function HelperText({ children }) {
  return <p className="mt-1 text-xs text-gray-500">{children}</p>;
}
function StatusPill({ kind }) {
  const map = {
    pending: "bg-amber-100 text-amber-700",
    approved: "bg-emerald-100 text-emerald-700",
    default: "bg-gray-100 text-gray-700",
  };
  const cls = map[kind] || map.default;
  const label = kind === "pending" ? "En attente" : kind === "approved" ? "Approuvé" : "—";
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium ${cls}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
      {label}
    </span>
  );
}

function SegmentedTabs({ value, onChange, items }) {
  const setTab = (t) => {
    onChange?.(t);
    if (typeof window !== "undefined") {
      const base = window.location.pathname;
      const qs = new URLSearchParams(window.location.search);
      qs.set("tab", t);
      window.history.replaceState({}, "", `${base}?${qs.toString()}`);
    }
  };
  return (
    <div className="inline-flex rounded-full bg-gray-100 p-1">
      {items.map((it) => (
        <button
          key={it.value}
          onClick={() => setTab(it.value)}
          className={[
            "px-4 py-2 text-sm rounded-full transition",
            value === it.value ? "bg-white shadow text-gray-900" : "text-gray-600 hover:text-gray-900",
          ].join(" ")}
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}

/** Controlled search input (now accepts value & onChange) */
function SearchBar({ name, value, onChange, placeholder }) {
  return (
    <div className="relative w-full sm:w-80">
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-3.6-3.6" />
      </svg>
      <input
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-lg border border-gray-300 bg-white pl-9 pr-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400"
        placeholder={placeholder}
      />
    </div>
  );
}

function AdminDashboard() {
  const {
    users = [],
    pendingContractors = [],
    approvedContractors = [],
    csrf_token,
    url,
    sites = [],
    errors = {},
    flash: _flash,
  } = usePage().props;
  const flash = _flash || {};

  // SweetAlert centered modal
  const fireSuccess = (message) =>
    Swal.fire({
      icon: "success",
      title: message,
      position: "center",
      showConfirmButton: false,
      timer: 1800,
      width: 520,
      iconColor: "#22c55e",
      backdrop: true,
    });
  const fireError = (message) =>
    Swal.fire({
      icon: "error",
      title: message,
      position: "center",
      showConfirmButton: false,
      timer: 2200,
      width: 520,
      backdrop: true,
    });

  useEffect(() => {
    if (flash?.success) fireSuccess(flash.success);
    if (flash?.error) fireError(flash.error);
  }, [flash?.success, flash?.error]);

  // tab from URL
  const getTabFromUrl = () => {
    if (typeof window === "undefined") return "parkx";
    const qs = new URLSearchParams(window.location.search);
    return qs.get("tab") || "parkx";
  };
  const [activeTab, setActiveTab] = useState(getTabFromUrl());
  useEffect(() => setActiveTab(getTabFromUrl()), [url]);

  // filters
  const [q, setQ] = useState("");
  const [siteFilter, setSiteFilter] = useState("");
  const [contractorFilter, setContractorFilter] = useState("all");

  const siteNameFor = (u) =>
    u?.site?.name ?? (u?.site_id ? (sites.find((s) => s.id === u.site_id)?.name || "—") : "—");

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const text = `${u.name} ${u.email} ${siteNameFor(u)}`.toLowerCase();
      const okQ = text.includes(q.toLowerCase());
      const okSite = siteFilter ? String(u.site_id || "") === String(siteFilter) : true;
      return okQ && okSite;
    });
  }, [users, q, siteFilter]);

  const rowsContractors = useMemo(() => {
    const pending = (pendingContractors || []).map((c) => ({ ...c, kind: "pending" }));
    const approved = (approvedContractors || []).map((c) => ({ ...c, kind: "approved" }));
    let merged = [];
    if (contractorFilter === "all" || contractorFilter === "pending") merged = merged.concat(pending);
    if (contractorFilter === "all" || contractorFilter === "approved") merged = merged.concat(approved);
    if (q) {
      merged = merged.filter((r) =>
        `${r.name} ${r.email} ${r.company_name || ""}`.toLowerCase().includes(q.toLowerCase())
      );
    }
    return merged.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
  }, [pendingContractors, approvedContractors, contractorFilter, q]);

  return (
    <div className="-m-4 md:-m-8 bg-white min-h-[calc(100vh-3.5rem)] p-4 md:p-8">
      {/* --------------------- PARKX TAB --------------------- */}
      {activeTab === "parkx" && (
        <>
          {/* Create user – FULL WIDTH & HORIZONTAL */}
          <div className="card-frame overflow-hidden mb-5">
            <div className="p-4 md:p-6">
              <h2 className="text-lg font-semibold mb-4">Créer un compte ParkX</h2>
              <form method="POST" action={route("admin.users.store")} className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <input type="hidden" name="_token" value={csrf_token} />

                {/* Nom */}
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium mb-1" htmlFor="name">Nom</label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="Nom complet"
                    className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 ${
                      errors.name ? "border-rose-400" : "border-gray-300"
                    }`}
                    required
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "err-name" : undefined}
                  />
                  <FieldError id="err-name">{errors.name}</FieldError>
                </div>

                {/* Site */}
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium mb-1" htmlFor="site_id">Site</label>
                  <select
                    id="site_id"
                    name="site_id"
                    className={`w-full rounded-lg border px-3 py-2 text-sm ${
                      errors.site_id ? "border-rose-400" : "border-gray-300"
                    }`}
                    defaultValue=""
                    aria-invalid={!!errors.site_id}
                    aria-describedby={errors.site_id ? "err-site" : undefined}
                  >
                    <option value="">— Aucun —</option>
                    {sites.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                  <FieldError id="err-site">{errors.site_id}</FieldError>
                </div>

                {/* Email */}
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="email@example.com"
                    className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 ${
                      errors.email ? "border-rose-400" : "border-gray-300"
                    }`}
                    required
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "err-email" : undefined}
                  />
                  <FieldError id="err-email">{errors.email}</FieldError>
                </div>

                {/* Mot de passe */}
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium mb-1" htmlFor="password">Mot de passe</label>
                  <input
                    id="password"
                    type="password"
                    name="password"
                    placeholder="Mot de passe"
                    minLength={8}
                    title="Au moins 8 caractères"
                    className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 ${
                      errors.password ? "border-rose-400" : "border-gray-300"
                    }`}
                    required
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? "err-password" : "help-password"}
                  />
                  {!errors.password && <HelperText>Au moins 8 caractères.</HelperText>}
                  <FieldError id="err-password">{errors.password}</FieldError>
                </div>

                {/* Confirmation */}
                <div className="md:col-span-6">
                  <label className="block text-sm font-medium mb-1" htmlFor="password_confirmation">
                    Confirmer le mot de passe
                  </label>
                  <input
                    id="password_confirmation"
                    type="password"
                    name="password_confirmation"
                    placeholder="Confirmer"
                    minLength={8}
                    title="Répétez le mot de passe (au moins 8 caractères)"
                    className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 ${
                      errors.password_confirmation ? "border-rose-400" : "border-gray-300"
                    }`}
                    required
                    aria-invalid={!!errors.password_confirmation}
                    aria-describedby={errors.password_confirmation ? "err-password_confirmation" : undefined}
                  />
                  <FieldError id="err-password_confirmation">{errors.password_confirmation}</FieldError>
                </div>

                {/* ⬇️ NEW: Toggle Accès Admin (same row width as confirmation) */}
                <div className="md:col-span-6 flex flex-col justify-end">
                  <label className="inline-flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      name="as_admin"
                      value="1"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                    <span>Donner l’accès au tableau de bord Admin</span>
                  </label>
                  <HelperText>
                    Crée / met à jour un compte <strong>Admin</strong> avec le même email et mot de passe.
                  </HelperText>
                </div>

                <div className="md:col-span-6 flex items-end justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center rounded-lg bg-indigo-600 text-white px-4 py-2 text-sm font-medium hover:bg-indigo-700"
                  >
                    Créer l’utilisateur
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Search & filters ABOVE THE LIST */}
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-wrap items-center gap-2 w-full"
            >
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Rechercher (nom, email, site)…"
                className="w-full sm:w-80 rounded-lg border border-gray-300 bg-white pl-9 pr-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400"
              />
              <select
                value={siteFilter}
                onChange={(e) => setSiteFilter(e.target.value)}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                title="Filtrer par site"
              >
                <option value="">Tous les sites</option>
                {sites.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <button className="inline-flex items-center gap-2 rounded-lg bg-black text-white px-4 py-2 text-sm font-medium hover:opacity-90">
                Filtrer
              </button>
            </form>
          </div>

          {/* USERS TABLE */}
          <div className="card-frame overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-[900px] w-full text-sm">
                <thead className="sticky top-0 z-10 bg-white">
                  <tr className="text-left text-gray-500/90 border-b">
                    <Th>Nom</Th>
                    <Th>Email</Th>
                    <Th>Site</Th>
                    <Th>VODs à rendre</Th>
                    <Th>Créé le</Th>
                    <Th className="text-right pr-4">Action</Th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                        Aucun utilisateur.
                      </td>
                    </tr>
                  )}

                  {filteredUsers.map((u, idx) => (
                    <tr
                      key={u.id}
                      className={`border-b last:border-0 ${idx % 2 ? "bg-gray-50/40" : ""} hover:bg-gray-50`}
                    >
                      <Td>{u.name}</Td>
                      <Td>{u.email}</Td>
                      <Td>{siteNameFor(u)}</Td>
                      <Td>
                        <form
                          method="POST"
                          action={route("admin.users.update-quota", u.id)}
                          className="flex items-center gap-2"
                        >
                          <input type="hidden" name="_token" value={csrf_token} />
                          <input
                            type="number"
                            name="vods_quota"
                            min="0"
                            defaultValue={u.vods_quota ?? 0}
                            className="w-24 rounded-lg border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                          />
                          <button
                            type="submit"
                            className="rounded-md bg-gray-900 text-white px-3 py-1.5 text-xs hover:bg-black/90"
                            title="Mettre à jour les VODs à rendre"
                          >
                            Sauver
                          </button>
                        </form>
                      </Td>
                      <Td>{new Date(u.created_at).toLocaleDateString("fr-FR")}</Td>
                      <Td className="text-right pr-4">
                        {/* SweetAlert confirm + form caché */}
                        <button
                          type="button"
                          onClick={async () => {
                            const res = await Swal.fire({
                              title: "Supprimer cet utilisateur ?",
                              text: "Cette action est irréversible.",
                              icon: "warning",
                              showCancelButton: true,
                              confirmButtonText: "Oui, supprimer",
                              cancelButtonText: "Annuler",
                              confirmButtonColor: "#dc2626",
                            });
                            if (res.isConfirmed) {
                              document.getElementById(`delete-user-${u.id}`).submit();
                            }
                          }}
                          className="rounded-full bg-rose-100 px-3 py-1.5 text-xs text-rose-700 hover:bg-rose-200"
                        >
                          Supprimer
                        </button>

                        <form
                          id={`delete-user-${u.id}`}
                          method="POST"
                          action={route("admin.users.delete", u.id)}
                          className="hidden"
                        >
                          <input type="hidden" name="_token" value={csrf_token} />
                        </form>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ------------------ CONTRACTORS TAB ------------------ */}
      {activeTab === "contractors" && (
        <>
          {/* Search/filters ABOVE list */}
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-wrap items-center gap-2 w-full">
              <SearchBar
                name="q"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Rechercher (nom, email, entreprise)…"
              />
              <select
                value={contractorFilter}
                onChange={(e) => setContractorFilter(e.target.value)}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                title="Filtrer par statut"
              >
                <option value="all">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="approved">Approuvé</option>
              </select>
              <button className="inline-flex items-center gap-2 rounded-lg bg-black text-white px-4 py-2 text-sm font-medium hover:opacity-90">
                Filtrer
              </button>
            </form>
          </div>

          <div className="card-frame overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-[900px] w-full text-sm">
                <thead className="sticky top-0 z-10 bg-white">
                  <tr className="text-left text-gray-500/90 border-b">
                    <Th>Nom</Th>
                    <Th>Email</Th>
                    <Th>Entreprise</Th>
                    <Th>Statut</Th>
                    <Th>Créé le</Th>
                    <Th className="text-right pr-4">Action</Th>
                  </tr>
                </thead>
                <tbody>
                  {rowsContractors.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                        Aucun résultat.
                      </td>
                    </tr>
                  )}

                  {rowsContractors.map((r, idx) => (
                    <tr
                      key={`${r.kind}-${r.id}`}
                      className={`border-b last:border-0 ${idx % 2 ? "bg-gray-50/40" : ""} hover:bg-gray-50`}
                    >
                      <Td>{r.name}</Td>
                      <Td>{r.email}</Td>
                      <Td>{r.company_name || "—"}</Td>
                      <Td><StatusPill kind={r.kind} /></Td>
                      <Td>{r.created_at ? new Date(r.created_at).toLocaleDateString("fr-FR") : "—"}</Td>
                      <Td className="text-right pr-4">
                        {r.kind === "pending" ? (
                          <div className="inline-flex gap-2">
                            <form method="POST" action={route("admin.contractors.approve", r.id)}>
                              <input type="hidden" name="_token" value={csrf_token} />
                              <button
                                type="submit"
                                className="rounded-full bg-emerald-100 px-3 py-1.5 text-xs text-emerald-700 hover:bg-emerald-200"
                              >
                                Approuver
                              </button>
                            </form>
                            <form method="POST" action={route("admin.contractors.reject", r.id)}>
                              <input type="hidden" name="_token" value={csrf_token} />
                              <button
                                type="submit"
                                className="rounded-full bg-rose-100 px-3 py-1.5 text-xs text-rose-700 hover:bg-rose-200"
                              >
                                Rejeter
                              </button>
                            </form>
                          </div>
                        ) : (
                          <>
                            {/* SweetAlert confirm + hidden form */}
                            <button
                              type="button"
                              onClick={async () => {
                                const res = await Swal.fire({
                                  title: "Supprimer ce contractant ?",
                                  text: "Cette action est irréversible.",
                                  icon: "warning",
                                  showCancelButton: true,
                                  confirmButtonText: "Oui, supprimer",
                                  cancelButtonText: "Annuler",
                                  confirmButtonColor: "#dc2626",
                                });
                                if (res.isConfirmed) {
                                  document.getElementById(`delete-contractor-${r.id}`).submit();
                                }
                              }}
                              className="rounded-full bg-rose-100 px-3 py-1.5 text-xs text-rose-700 hover:bg-rose-200"
                            >
                              Supprimer
                            </button>

                            <form
                              id={`delete-contractor-${r.id}`}
                              method="POST"
                              action={route("admin.contractors.delete", r.id)}
                              className="hidden"
                            >
                              <input type="hidden" name="_token" value={csrf_token} />
                            </form>
                          </>
                        )}
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* same card look as your Signatures page */}
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

AdminDashboard.layout = (page) => <AdminLayout>{page}</AdminLayout>;
export default AdminDashboard;
