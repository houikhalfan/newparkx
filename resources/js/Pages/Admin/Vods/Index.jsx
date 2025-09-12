// resources/js/Pages/Admin/Vods/Index.jsx
import React, { useEffect, useState } from "react";
import { usePage, Link } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Download, BarChart3 } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// ✅ Register chart.js modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

/* ---------------------- STATS COMPONENT ---------------------- */
function VodsStats() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [selectedUser, setSelectedUser] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`/admin/vods/stats-data?year=${year}`)
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        if (!selectedUser && d.byUser.length > 0) {
          setSelectedUser(d.byUser[0].id); // default first employee
        }
      });
  }, [year]);

  if (!data) return <div>Chargement…</div>;

  const user = (data.byUser || []).find((u) => u.id === selectedUser);

  // Monthly data for the selected user
  const monthlyDone = Array.from({ length: 12 }, (_, i) => {
    const rec = ((data.byMonth && data.byMonth[user?.id]) || []).find(
      (r) => r.m === i + 1
    );
    return rec ? rec.cnt : 0;
  });

  const monthlyMissed = monthlyDone.map(
    (done) =>
      (user?.quota || 0) - done > 0 ? (user?.quota || 0) - done : 0
  );

  return (
    <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* 🔽 Filters + progression alignés */}
      {user && (
        <div className="p-4 border rounded-lg bg-white shadow col-span-2">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
            <h2 className="font-semibold">
              Progression de {user.name} ({year})
            </h2>
            <div className="flex gap-2">
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="border rounded px-2 py-1"
              >
                {[2023, 2024, 2025].map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>

              <select
                value={selectedUser || ""}
                onChange={(e) => setSelectedUser(Number(e.target.value))}
                className="border rounded px-2 py-1"
              >
                {(data.byUser || []).map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="h-72">
            <Bar
              data={{
                labels: [
                  "Jan","Fév","Mar","Avr","Mai","Juin",
                  "Juil","Août","Sep","Oct","Nov","Déc",
                ],
                datasets: [
                  {
                    label: "Réalisé",
                    data: monthlyDone,
                    backgroundColor: "#e7e9e7", // Gray Nurse
                    barThickness: 20,
                    maxBarThickness: 25,
                  },
                  {
                    label: "Manqué",
                    data: monthlyMissed,
                    backgroundColor: "#848484", // Gray
                    barThickness: 20,
                    maxBarThickness: 25,
                  },
                ],
              }}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: "bottom" },
                  tooltip: {
                    callbacks: {
                      label: (ctx) =>
                        ctx.dataset.label === "Réalisé"
                          ? `Accomplis: ${ctx.raw}`
                          : `Manqués: ${ctx.raw}`,
                    },
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1 }, // ✅ nombres entiers uniquement
                    title: { display: true, text: "Nombre de VODs" },
                  },
                },
              }}
            />
          </div>
        </div>
      )}

      {/* ✅ VODs réalisés par contractant */}
      <div className="p-4 border rounded-lg bg-white shadow">
        <h2 className="font-semibold mb-3">VODs réalisés par Contractant</h2>
        <div className="h-72">
          <Bar
            data={{
              labels: data.byCompany.map((c) => c.company),
              datasets: [
                {
                  label: "VODs réalisés",
                  data: data.byCompany.map((c) => c.count),
                  backgroundColor: [
                    "#d0dcdf", // Geyser
                    "#5fb2bc", // Fountain Blue
                    "#f16455", // Burnt Sienna
                    "#c1c74a", // Turmeric
                  ],
                  barThickness: 25,
                  maxBarThickness: 30,
                },
              ],
            }}
            options={{
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: { stepSize: 1 },
                  title: { display: true, text: "Nombre de VODs" },
                },
              },
            }}
          />
        </div>
      </div>

      {/* Risques */}
      <div className="p-4 border rounded-lg bg-white shadow">
        <h2 className="font-semibold mb-3">Risques observés</h2>
        <div className="h-64">
          <Bar
            data={{
              labels: Object.keys(data.risks),
              datasets: [
                {
                  label: "Occurrences",
                  data: Object.values(data.risks),
                  backgroundColor: "#308995", // Astral
                  barThickness: 20,
                  maxBarThickness: 25,
                },
              ],
            }}
            options={{
              maintainAspectRatio: false,
              scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
            }}
          />
        </div>
      </div>

      {/* Conditions */}
      <div className="p-4 border rounded-lg bg-white shadow">
        <h2 className="font-semibold mb-3">Conditions dangereuses observées</h2>
        <div className="h-64">
          <Bar
            data={{
              labels: Object.keys(data.conditions),
              datasets: [
                {
                  label: "Occurrences",
                  data: Object.values(data.conditions),
                  backgroundColor: "#c1c74a", // Turmeric
                  barThickness: 20,
                  maxBarThickness: 25,
                },
              ],
            }}
            options={{
              maintainAspectRatio: false,
              scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
            }}
          />
        </div>
      </div>
    </div>
  );
}

/* ---------------------- HELPERS ---------------------- */
function Th({ children, className = "" }) {
  return (
    <th className={`px-4 py-3 text-xs font-medium uppercase tracking-wide`}>
      {children}
    </th>
  );
}
function Td({ children, className = "" }) {
  return <td className={`px-4 py-3 align-middle ${className}`}>{children}</td>;
}

function fmtDate(d, withTime = false) {
  if (!d) return "—";
  try {
    const date = new Date(d);
    return withTime
      ? date.toLocaleString("fr-FR", {
          dateStyle: "short",
          timeStyle: "medium",
        })
      : date.toLocaleDateString("fr-FR");
  } catch {
    return d || "—";
  }
}

function FileLink({ url, label = "Voir le PDF" }) {
  if (!url) return <span className="text-gray-400">—</span>;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md px-2 py-1"
      title={url}
    >
      <Download size={16} />
      <span className="text-xs font-medium">{label}</span>
    </a>
  );
}

function localizePagination(label) {
  return String(label)
    .replace(/Previous|&laquo;\s*Previous/gi, "Précédent")
    .replace(/Next|Next\s*&raquo;/gi, "Suivant");
}

function normalizeVods(input) {
  if (!input) return { data: [], links: [] };
  if (Array.isArray(input)) return { data: input, links: [] };
  return {
    data: input.data || [],
    links: input.links || [],
  };
}

/* ---------------------- MAIN PAGE ---------------------- */
export default function AdminVodsIndex() {
  const props = usePage().props || {};
  const { vods, filters } = props;
  const list = normalizeVods(vods);
  const q = (filters && filters.q) || "";

  const [showStats, setShowStats] = useState(true);

  return (
    <div className="-m-4 md:-m-8 bg-white min-h-[calc(100vh-3.5rem)] p-4 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            VODs
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">
            Recherchez et visualisez les Visites d’Observation.
          </p>
        </div>
        {/* 🔽 Toggle stats */}
        <button
          onClick={() => setShowStats(!showStats)}
          className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-sm px-3 py-1.5 rounded-lg"
        >
          <BarChart3 size={16} />
          {showStats ? "Masquer Statistiques" : "Afficher Statistiques"}
        </button>
      </div>

      {/* 🔥 STATS DASHBOARD */}
      {showStats && (
        <div className="transition-all duration-300">
          <VodsStats />
        </div>
      )}

      {/* Filters */}
      <form method="GET" className="mb-5 flex flex-wrap items-center gap-2">
        <div className="relative w-full sm:w-96">
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
            name="q"
            defaultValue={q}
            className="w-full rounded-lg border border-gray-300 bg-white pl-9 pr-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400"
            placeholder="Rechercher (utilisateur, projet, activité, entreprise…)"
          />
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-black text-white px-4 py-2 text-sm font-medium hover:opacity-90">
          Filtrer
        </button>
      </form>

      {/* Table card */}
      <div className="card-frame overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[1100px] w-full text-sm">
            <thead className="sticky top-0 z-10 bg-white">
              <tr className="text-left text-gray-500/90 border-b">
                <Th>Observateur</Th>
                <Th>Origine</Th>
                <Th>Date d’émission</Th>
                <Th>Date de la visite</Th>
                <Th>Projet</Th>
                <Th>Entreprises observées</Th>
                <Th className="pr-4 text-center">PDF</Th>
              </tr>
            </thead>
            <tbody>
              {list.data.map((v, idx) => (
                <tr
                  key={v.id}
                  className={`border-b last:border-0 ${
                    idx % 2 ? "bg-gray-50/40" : ""
                  } hover:bg-gray-50`}
                >
                  <Td>
                    <div className="font-medium">{v.user?.name || "—"}</div>
                    <div className="text-xs text-gray-500">
                      {v.user?.email || ""}
                    </div>
                  </Td>
                  <Td>
                    <span className="px-2 py-1 rounded-md text-xs font-medium bg-gray-100">
                      {v.origine}
                    </span>
                  </Td>
                  <Td>{fmtDate(v.emitted_at, true)}</Td>
                  <Td>{fmtDate(v.visit_date)}</Td>
                  <Td>{v.projet || "—"}</Td>
                  <Td>
                    {Array.isArray(v.entreprises)
                      ? v.entreprises.join(", ")
                      : "—"}
                  </Td>
                  <Td className="text-center pr-4">
                    <FileLink url={v.pdf_url} label="Télécharger le PDF" />
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {list.links.length > 0 && (
          <div className="p-4 flex flex-wrap items-center gap-2 justify-end text-sm">
            {list.links.map((l, i) => (
              <Link
                key={i}
                href={l.url || "#"}
                preserveScroll
                preserveState
                className={[
                  "rounded-md px-3 py-1.5",
                  l.active
                    ? "bg-black text-white"
                    : l.url
                    ? "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    : "bg-gray-100 text-gray-400 cursor-default",
                ].join(" ")}
                dangerouslySetInnerHTML={{
                  __html: localizePagination(l.label),
                }}
              />
            ))}
          </div>
        )}
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

AdminVodsIndex.layout = (page) => <AdminLayout>{page}</AdminLayout>;
