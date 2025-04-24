interface Criteria {
  name: string;
  weight: number;
  type: "benefit" | "cost";
}

interface Alternative {
  id: string;
  name: string;
  values: {
    [key: string]: number;
  };
}

export const calculateSAW = (
  alternatives: Alternative[],
  criteria: Criteria[]
): Alternative[] => {
  // 1. Normalisasi matriks
  const normalizedMatrix = alternatives.map((alternative) => {
    const normalizedValues: { [key: string]: number } = {};

    criteria.forEach((criterion) => {
      const values = alternatives.map((alt) => alt.values[criterion.name]);
      const max = Math.max(...values);
      const min = Math.min(...values);

      if (criterion.type === "benefit") {
        normalizedValues[criterion.name] =
          alternative.values[criterion.name] / max;
      } else {
        normalizedValues[criterion.name] =
          min / alternative.values[criterion.name];
      }
    });

    return {
      ...alternative,
      normalizedValues,
    };
  });

  // 2. Perhitungan nilai preferensi
  const rankedAlternatives = normalizedMatrix.map((alternative) => {
    let preferenceValue = 0;

    criteria.forEach((criterion) => {
      preferenceValue +=
        alternative.normalizedValues[criterion.name] * criterion.weight;
    });

    return {
      ...alternative,
      preferenceValue,
    };
  });

  // 3. Pengurutan berdasarkan nilai preferensi
  return rankedAlternatives
    .sort((a, b) => b.preferenceValue - a.preferenceValue)
    .map(({ id, name, values }) => ({ id, name, values }));
};

// Contoh penggunaan:
const criteria: Criteria[] = [
  { name: "rating", weight: 0.4, type: "benefit" },
  { name: "price", weight: 0.3, type: "cost" },
  { name: "distance", weight: 0.3, type: "cost" },
];

const alternatives: Alternative[] = [
  {
    id: "1",
    name: "Tempat A",
    values: {
      rating: 4.5,
      price: 50000,
      distance: 2.5,
    },
  },
  {
    id: "2",
    name: "Tempat B",
    values: {
      rating: 4.0,
      price: 30000,
      distance: 1.5,
    },
  },
];

// const result = calculateSAW(alternatives, criteria);
