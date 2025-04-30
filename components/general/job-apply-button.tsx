// örneğin src/app/components/JobApplyButton.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  jobId: string;
}

export function JobApplyButton({ jobId }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  async function handleApply() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/jobs/${jobId}/apply`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Başvuru başarısız.");
      setSuccess(true);
      // İstersen sayfayı yenileyebilirsin:
      // router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <button disabled className="btn-disabled">
        Başvuru Alındı ✔️
      </button>
    );
  }

  return (
    <>
      <button onClick={handleApply} disabled={loading} className="btn-primary">
        {loading ? "Lütfen Bekleyin..." : "Apply Now"}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </>
  );
}
