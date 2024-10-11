import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function formatCurrency(amount: string | number): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(numAmount);
}

interface ResultDisplayProps {
  result: {
    cost: {
      cementCost: string;
      sandCost: string;
      gravelCost: string;
      waterCost: string;
      rebarCost: string;
      stirrupCost: string;
      woodFormCost: string;
      totalPrice: string;
    };
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
      volume: string;
      QTY: number;
    };
  };
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  const costData = [
    { category: 'Semen', cost: result.cost.cementCost, volume: `${result.concrete.cement.weight} kg (${result.concrete.cement.sacks} sak)` },
    { category: 'Pasir', cost: result.cost.sandCost, volume: `${result.concrete.sand} m³` },
    { category: 'Kerikil', cost: result.cost.gravelCost, volume: `${result.concrete.gravel} m³` },
    { category: 'Air', cost: result.cost.waterCost, volume: `${result.concrete.water} liter` },
    { category: 'Besi Tulangan Utama', cost: result.cost.rebarCost, volume: `${result.rebar.mainRebar.weight} kg (${result.rebar.mainRebar.bars} batang)` },
    { category: 'Besi Sengkang', cost: result.cost.stirrupCost, volume: `${result.rebar.stirrup.weight} kg (${result.rebar.stirrup.bars} batang)` },
    { category: 'Bekisting', cost: result.cost.woodFormCost, volume: `${result.formwork.volume} m³ (${result.formwork.QTY} lembar)` },
    { category: 'Total', cost: result.cost.totalPrice, volume: '-' },
  ];

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Hasil Perhitungan Biaya Sloof</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>Mutu Beton: {result.concrete.grade}, Volume Beton: {result.concrete.volume} m³</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Kategori</TableHead>
              <TableHead>Volume/Berat</TableHead>
              <TableHead className="text-right">Biaya</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {costData.map((item, index) => (
              <TableRow key={index} className={item.category === 'Total' ? 'font-bold' : ''}>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.volume}</TableCell>
                <TableCell className="text-right">{formatCurrency(item.cost)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Informasi Tambahan:</h4>
          <p>Tulangan Utama: Ø{result.rebar.mainRebar.size} mm</p>
          <p>Sengkang: Ø{result.rebar.stirrup.size} mm, Panjang per Sengkang: {result.rebar.stirrup.perimeter} m</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultDisplay;