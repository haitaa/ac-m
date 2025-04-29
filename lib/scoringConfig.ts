export interface ActivityDefinition {
  /** Tablo’daki kod (ör. "A1") */
  code: string;
  /** Madde başlığı (ekranda gösterim için) */
  label: string;
  /** Bu madde için tek yayın başına düşen puan */
  basePoints: number;
  /** Yazar sayısına göre k katsayısı uygulanacak mı? */
  useAuthorCoefficient: boolean;
}

export const authorCoefficients: { [nPeople: number]: number } = {
  1: 1,
  2: 0.8,
  3: 0.6,
  4: 0.5,
  // 5–9 arası kişi: 1 / nPeople
  // 10 ve fazlası: 1/10
};

export function getAuthorCoefficient(n: number) {
  if (n <= 4) return authorCoefficients[n];
  if (n <= 9) return 1 / n;
  return 1 / 10;
}

export const scoringConfig: ActivityDefinition[] = [
  // A.1: Q1 dergide yayımlanmış makale → 60 puan
  {
    code: "A1",
    label: "SCI-E/SSCI/AHCI Q1 makale",
    basePoints: 60,
    useAuthorCoefficient: true,
  },
  // A.2: Q2 dergide → 55 puan
  {
    code: "A2",
    label: "SCI-E/SSCI/AHCI Q2 makale",
    basePoints: 55,
    useAuthorCoefficient: true,
  },
  // …
  {
    code: "A3",
    label: "SCI-E/SSCI/AHCI Q3 makale",
    basePoints: 40,
    useAuthorCoefficient: true,
  },
  {
    code: "A4",
    label: "SCI-E/SSCI/AHCI Q4 makale",
    basePoints: 30,
    useAuthorCoefficient: true,
  },
  {
    code: "A5",
    label: "ESCI dergilerde makale",
    basePoints: 25,
    useAuthorCoefficient: true,
  },
  {
    code: "A6",
    label: "Scopus dergilerde makale",
    basePoints: 20,
    useAuthorCoefficient: true,
  },
  {
    code: "A7",
    label: "Diğer uluslararası indeksli makale",
    basePoints: 15,
    useAuthorCoefficient: true,
  },
  {
    code: "A8",
    label: "ULAKBİM TR dizin makale",
    basePoints: 10,
    useAuthorCoefficient: true,
  },
  // Buraya B, C, … bölümlerini de ekleyin
];
