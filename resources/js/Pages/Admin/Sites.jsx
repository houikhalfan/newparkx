import React, { useEffect, useState } from "react";
import { usePage, Link, router } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import AdminLayout from "@/Layouts/AdminLayout";
import Swal from "sweetalert2";
import {
  MapPin,
  Users,
  Shield,
  Plus,
  Edit3,
  Trash2,
  Building2,
  UserCheck,
  AlertCircle,
  CheckCircle,
  Save,
  X,
} from "lucide-react";

export default function SitesPage() {
  const { users = [], sites = [], csrf_token, flash = {} } = usePage().props || {};
  const [isLoaded, setIsLoaded] = useState(false);
  const [rows, setRows] = useState(mapSitesToRows(sites));
  const [editingRow, setEditingRow] = useState(null);
  const [createForm, setCreateForm] = useState({ name: "", responsible_user_id: "", responsible_hse_id: "" });

  useEffect(() => {
    setRows(mapSitesToRows(sites));
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, [sites]);

  useEffect(() => {
    if (flash?.success) {
      Swal.fire({ icon: "success", title: flash.success, timer: 1600, showConfirmButton: false });
    } else if (flash?.error) {
      Swal.fire({ icon: "error", title: flash.error });
    }
  }, [flash]);

  const submitCreate = (e) => {
    e.preventDefault();
    router.post(
      route("admin.sites.store"),
      {
        name: createForm.name,
        responsible_user_id: createForm.responsible_user_id || null,
        responsible_hse_id: createForm.responsible_hse_id || null,
      },
      {
        preserveScroll: true,
        replace: true,
        onSuccess: () => {
          setCreateForm({ name: "", responsible_user_id: "", responsible_hse_id: "" });
          router.reload({ only: ["sites"] });
          Swal.fire({ icon: "success", title: "Site créé", timer: 1200, showConfirmButton: false });
        },
        onError: (errors) => {
          Swal.fire({ icon: "error", title: "Création échouée", text: Object.values(errors).join("\n") });
        },
      }
    );
  };

  const submitUpdate = (row) => {
    router.post(
      route("admin.sites.update", row.id),
      {
        _token: csrf_token,
        name: row.name,
        responsible_user_id: row.responsible_user_id || null,
        responsible_hse_id: row.responsible_hse_id || null,
      },
      {
        preserveScroll: true,
        replace: true,
        onSuccess: () => {
          setEditingRow(null);
          router.reload({ only: ["sites"] });
          Swal.fire({ icon: "success", title: "Site mis à jour", timer: 1200, showConfirmButton: false });
        },
        onError: (errors) => {
          Swal.fire({ icon: "error", title: "Mise à jour échouée", text: Object.values(errors).join("\n") });
        },
      }
    );
  };

  const submitDelete = (id) => {
    Swal.fire({
      icon: "warning",
      title: "Supprimer ce site ?",
      text: "Cette action est irréversible.",
      showCancelButton: true,
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    }).then((res) => {
      if (!res.isConfirmed) return;

      router.post(
        route("admin.sites.delete", id),
        { _token: csrf_token },
        {
          preserveScroll: true,
          replace: true,
          onSuccess: () => {
            router.reload({ only: ["sites"] });
            Swal.fire({ icon: "success", title: "Site supprimé", timer: 1200, showConfirmButton: false });
          },
          onError: () => Swal.fire({ icon: "error", title: "Impossible de supprimer le site" }),
        }
      );
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 p-6 md:p-8">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg"
            >
              <MapPin className="w-7 h-7 text-white" />
            </motion.div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 dark:from-white dark:via-blue-100 dark:to-indigo-100 bg-clip-text text-transparent">
                Gestion des Sites
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300 mt-2">
                Gérez la liste des sites industriels et leurs responsables
              </p>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Create Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-8"
        >
          <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10" />
            <div className="relative p-6">
              <div className="flex items-center gap-3 mb-6">
                <motion.div
                  whileHover={{ rotate: 5 }}
                  className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl shadow-lg"
                >
                  <Plus className="w-5 h-5 text-white" />
                </motion.div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Créer un nouveau site</h2>
              </div>
              
              <form onSubmit={submitCreate} className="grid md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Nom du site
                  </label>
                  <input
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={createForm.name}
                    onChange={(e) => setCreateForm((f) => ({ ...f, name: e.target.value }))}
                    required
                    placeholder="Ex: Bengurir"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Responsable de site
                  </label>
                  <select
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={createForm.responsible_user_id}
                    onChange={(e) => setCreateForm((f) => ({ ...f, responsible_user_id: e.target.value }))}
                  >
                    <option value="">— Aucun —</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Responsable HSE
                  </label>
                  <select
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={createForm.responsible_hse_id}
                    onChange={(e) => setCreateForm((f) => ({ ...f, responsible_hse_id: e.target.value }))}
                  >
                    <option value="">— Aucun —</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Plus className="w-4 h-4" />
                    Ajouter le site
                  </motion.button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Sites List */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg"
        >
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ rotate: 5 }}
                className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl shadow-lg"
              >
                <Building2 className="w-5 h-5 text-white" />
              </motion.div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Liste des sites</h2>
              <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full text-sm font-medium">
                {rows.length} site{rows.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[1100px] w-full text-sm">
              <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-slate-700">
                <tr className="text-left text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-600">
                  <Th>Nom</Th>
                  <Th>Responsable</Th>
                  <Th>Responsable HSE</Th>
                  <Th>Employés</Th>
                  <Th className="text-right pr-4">Actions</Th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {rows.length === 0 && (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b last:border-0"
                    >
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                            <MapPin className="w-8 h-8 text-slate-400" />
                          </div>
                          <p className="text-slate-500 dark:text-slate-400 text-lg">Aucun site créé</p>
                          <p className="text-slate-400 dark:text-slate-500 text-sm">Commencez par créer votre premier site</p>
                        </div>
                      </td>
                    </motion.tr>
                  )}

                  {rows.map((r, idx) => (
                    <motion.tr
                      key={r.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`border-b last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${
                        idx % 2 ? "bg-slate-50/30 dark:bg-slate-800/30" : ""
                      }`}
                    >
                      <Td>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                          <input
                            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            value={r.name}
                            onChange={(e) =>
                              setRows((prev) => prev.map((x) => (x.id === r.id ? { ...x, name: e.target.value } : x)))
                            }
                          />
                        </div>
                      </Td>

                      <Td>
                        <select
                          className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          value={r.responsible_user_id}
                          onChange={(e) =>
                            setRows((prev) => prev.map((x) => (x.id === r.id ? { ...x, responsible_user_id: e.target.value } : x)))
                          }
                        >
                          <option value="">— Aucun —</option>
                          {users.map((u) => (
                            <option key={u.id} value={u.id}>
                              {u.name} ({u.email})
                            </option>
                          ))}
                        </select>
                      </Td>

                      <Td>
                        <select
                          className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          value={r.responsible_hse_id}
                          onChange={(e) =>
                            setRows((prev) => prev.map((x) => (x.id === r.id ? { ...x, responsible_hse_id: e.target.value } : x)))
                          }
                        >
                          <option value="">— Aucun —</option>
                          {users.map((u) => (
                            <option key={u.id} value={u.id}>
                              {u.name} ({u.email})
                            </option>
                          ))}
                        </select>
                      </Td>

                      <Td>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-slate-400" />
                          <span className="font-medium text-slate-900 dark:text-white">{r.employees_count}</span>
                        </div>
                      </Td>

                      <td className="py-3 pl-4 pr-4 text-right">
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => submitUpdate(r)}
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 text-white px-4 py-2 text-sm font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
                          >
                            <Save className="w-4 h-4" />
                            Mettre à jour
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => submitDelete(r.id)}
                            className="inline-flex items-center gap-2 rounded-lg bg-rose-100 text-rose-700 hover:bg-rose-200 px-4 py-2 text-sm font-semibold transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            Supprimer
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function mapSitesToRows(sites) {
  return (sites || []).map((s) => ({
    id: s.id,
    name: s.name,
    responsible_user_id: s.manager?.id || "",
    responsible_hse_id: s.hse_manager?.id || "",
    employees_count: s.employees_count || 0,
  }));
}

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

SitesPage.layout = (page) => <AdminLayout>{page}</AdminLayout>;
