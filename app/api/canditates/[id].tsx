import { useRouter } from "next/router";
import useSWR from "swr";

export default function CandidateAdmin() {
  const router = useRouter();
  const { id } = router.query;
  const { data, mutate } = useSWR(id ? `/api/candidates/${id}` : null);

  const recalc = async () => {
    await fetch(`/api/candidates/${id}/score`, { method: "POST" });
    mutate();
  };

  if (!data) return <div>Yükleniyor…</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Aday: {data.name}</h1>
      <button
        onClick={recalc}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Puanı Hesapla
      </button>

      {data.totalScore != null && (
        <div className="mt-4">
          <strong>Toplam Puan:</strong> {data.totalScore}
        </div>
      )}
    </div>
  );
}
