import React, { useEffect, useState } from "react";
import ContractantLayout from "@/Pages/ContractantLayout";
import VodsForm from "./Form";
import VodsHistory from "./History";

export default function ContractantVodsIndex() {
  const [active, setActive] = useState("form");
  const [loading, setLoading] = useState(false);
  const [historyVods, setHistoryVods] = useState(null);

  // Load history data only when needed
  useEffect(() => {
    if (active !== "history" || historyVods !== null) return;
    setLoading(true);
    fetch("/contractant/vods/history/data", { credentials: "same-origin" })
      .then((r) => r.json())
      .then((d) => setHistoryVods(d?.vods || []))
      .finally(() => setLoading(false));
  }, [active, historyVods]);

  return (
    <ContractantLayout title="VODs" active="vods">
      <div className="mb-6">
        <nav className="flex gap-3 border-b pb-2">
          <button
            onClick={() => setActive("form")}
            className={`px-3 py-1.5 rounded ${
              active === "form" ? "bg-blue-600 text-white" : "hover:bg-gray-100"
            }`}
          >
            Remplir
          </button>
          <button
            onClick={() => setActive("history")}
            className={`px-3 py-1.5 rounded ${
              active === "history" ? "bg-blue-600 text-white" : "hover:bg-gray-100"
            }`}
          >
            Historique
          </button>
        </nav>
      </div>

      {active === "form" && <VodsForm />}

      {active === "history" && (
        <>
          {loading && historyVods === null ? (
            <div className="text-gray-500">Chargement…</div>
          ) : (
            <VodsHistory vods={historyVods || []} />
          )}
        </>
      )}
    </ContractantLayout>
  );
}
