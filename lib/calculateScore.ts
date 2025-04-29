import { scoringConfig, getAuthorCoefficient } from "./scoringConfig";

/**
 * Adayın her bir madde için gönderdiği veri:
 *   count: kaç adet yayın/etkinlik
 *   authors: o yayının kaç yazarı var (isteğe bağlı; useAuthorCoefficient=true maddeler için zorunlu)
 */
export interface CandidateActivity {
  [activityCode: string]: {
    count: number;
    authors?: number;
  };
}

export function calculateTotalScore(activities: CandidateActivity): number {
  let total = 0;

  scoringConfig.forEach((def) => {
    const entry = activities[def.code];
    if (!entry || entry.count <= 0) return;

    if (def.useAuthorCoefficient) {
      if (!entry.authors) {
        throw new Error(`${def.code} için authors bilgisi eksik`);
      }
      const k = getAuthorCoefficient(entry.authors);
      total += entry.count * def.basePoints * k;
    } else {
      total += entry.count * def.basePoints;
    }
  });

  // eğer virgüllü puan ise, yönetmelik uyarınca:
  // virgülden sonraki ilk rakam <5 ise aşağı doğru, ≥5 ise yukarı yuvarla.
  return Math.round(total);
}
