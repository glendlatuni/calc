import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

interface SloofData {
  concrete: {
    grade: string;
    volume: string;
    cement: {
      weight: string;
      sacks: number;
    };

    sand: string;
    gravel: string;
    water: string;
  };

  rebar: {
    mainRebar: {
      size: number;
      weight: string;
      bars: number;
    };
    stirrup: {
      size: number;
      weight: string;
      bars: number;
      perimeter: string;
    };
  };

  formwork: {
    area: number;
    plywoodSheet: number;
  };
}

export const exportExcelSloof = (result: SloofData) => {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet([
    {
      "Mututu Beton": `${result.concrete.grade}`,
      "Volume (m3)": `${result.concrete.volume}`,
      Semen: `${result.concrete.cement.weight} kg (${result.concrete.cement.sacks} sak)`,
      Pasir: `${result.concrete.sand} m³`,
      Kerikil: `${result.concrete.gravel} m³`,
      Air: `${result.concrete.water} liter`,
      "Tulangan Utama": `${result.rebar.mainRebar.weight} kg (${result.rebar.mainRebar.bars} batang)`,
      "Ukuran Tulangan Utama": `${result.rebar.mainRebar.size} mm`,
      Sengkang: `${result.rebar.stirrup.weight} kg (${result.rebar.stirrup.bars} batang)`,
      "Ukuran Sengkang": `${result.rebar.stirrup.size} mm`,
      "Panjang per Sengkang": `${result.rebar.stirrup.perimeter} m`,
      "Luas Bekisting": `${result.formwork.area.toFixed(2)} m²`,
  
    },
  ]);
  XLSX.utils.book_append_sheet(workbook, worksheet, "Hasil Perhitungan");
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(data, "hasil_perhitungan_sloof.xlsx");
};
