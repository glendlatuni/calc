interface ConcreteMaterial {
  cement: number; // kg per m3
  sand: number; // m3 per m3 beton
  gravel: number; // m3 per m3 beton
  water: number; // liter per m3
}

interface RebarProperties {
  size: number; // diameter dalam mm
  weightPerMeter: number; // berat dalam kg/m
}

// interface Dimension {
//   width: number;
//   length: number;
//   height: number;
// }


interface DimForSloofFormwork {
  length: number;
  height: number;
}

interface Dimension2 {
  height: number;
  length: number;
}

interface FormWorkResult {
  area: number;
  plywoodSheet: number;
}

interface WoodFormWorkResult {
  volume: number;
  QTY: number;
}

export class ConcreteCalculator {
  // Interface untuk material beton

  // Fungsi untuk menampung mutu beton dan kebutuhan material
  public getConcreteMixture(grade: string): ConcreteMaterial {
    const mixtures: { [key: string]: ConcreteMaterial } = {
      K175: {
        cement: 305, // kg
        sand: 0.488, // m³ (kg -> m³, density: 1.4)
        gravel: 0.731, // m³ (kg -> m³, density: 1.5)
        water: 215, // liter
      },
      K200: {
        cement: 320, // kg
        sand: 0.52, // m³ (kg -> m³)
        gravel: 0.8, // m³ (kg -> m³)
        water: 210, // liter
      },
      K225: {
        cement: 350, // kg
        sand: 0.588, // m³ (823.2 kg of sand, converted to m³ using density 1.4)
        gravel: 0.8856, // m³ (1,328.4 kg of gravel, converted to m³ using density 1.5)
        water: 215, // liter
      },
      K250: {
        cement: 380, // kg
        sand: 0.48, // m³
        gravel: 0.76, // m³
        water: 200, // liter
      },
      K300: {
        cement: 400, // kg
        sand: 0.46, // m³
        gravel: 0.74, // m³
        water: 195, // liter
      },
    };

    return mixtures[grade] || { cement: 0, sand: 0, gravel: 0, water: 0 };
  }

  // Fungsi untuk menampung properti jenis besi beton
  public getRebarProperties(size: number): RebarProperties {
    const properties: { [key: number]: RebarProperties } = {
      6: { size: 6, weightPerMeter: 0.222 },
      8: { size: 8, weightPerMeter: 0.395 },
      10: { size: 10, weightPerMeter: 0.617 },
      12: { size: 12, weightPerMeter: 0.888 },
      16: { size: 16, weightPerMeter: 1.578 },
      19: { size: 19, weightPerMeter: 2.226 },
      22: { size: 22, weightPerMeter: 2.984 },
      25: { size: 25, weightPerMeter: 3.853 },
    };

    return properties[size] || { size: 0, weightPerMeter: 0 };
  }

  // untuk menghitung bekisting sloof
  public calculateFormwork(dimensions: DimForSloofFormwork): WoodFormWorkResult {
    const { length, height } = dimensions;

   
    const Area = (height * 2  ) * length;

    const woodVolume = Area * 0.03 * 1.15;

    const singleWoodVolume = 0.024; // asumsikan ukuran 1 buah papan 3x20x400 cm

    const woodQTY = Math.ceil(woodVolume / singleWoodVolume);

    return {
      volume: woodVolume,
      QTY: woodQTY,
    };
  }

  public calculateFormWorkSloof(dimensions: Dimension2): FormWorkResult {
    const { length, height } = dimensions;
    const overStake = 0.02;

    const totalArea = 2 * (length + overStake) * (height + overStake);

    const plywoodArea = 2.9768;
    const plywoodSheets = Math.ceil(totalArea / plywoodArea);

    return {
      area: totalArea,
      plywoodSheet: plywoodSheets,
    };
  }
}
