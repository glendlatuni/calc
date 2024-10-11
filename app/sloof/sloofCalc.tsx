"use client";

import React, { useState } from "react";
import { ConcreteCalculator } from "@/lib/materialPropertis";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { exportExcelSloof } from "@/lib/exportExcel";
import { Download } from "lucide-react";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import getBasicPrice from "@/lib/getPrice";

import ResultDisplay from "./tableResult";

const calculator = new ConcreteCalculator();

type FormInput = {
  length: number;
  width: number;
  height: number;
  concreteCover: number;
  concreteGrade: string;
  mainRebarSize: number;
  mainRebarCount: number;
  stirrupSize: number;
  stirrupSpacing: number;
};



const SloofCalculatorForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormInput>();



  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [result, setResult] = useState<any>(null);

  const concreteGrades = ["K175", "K200", "K225", "K250", "K300"];
  const rebarSizes = [6, 8, 10, 12, 16, 19, 22, 25];

  const onSubmit: SubmitHandler<FormInput> = (data, event) => {

    if (event){
      event.preventDefault();
    }

    if (data.mainRebarSize > data.stirrupSize) {
      setAlertMessage("Ukuran tulang utama harus lebih besar dari sengkang");
      setShowAlert(true);
      return;
    }

    calculateMaterials(data);
  };

  const calculateMaterials = (data: FormInput) => {
    const width = data.width;
    const height = data.height;
    const concreteCover = data.concreteCover;
    const hookLength = 5;

    const cementPrice = getBasicPrice("Semen Portland (PC) @ 50 Kg perKg") || 0;
    const sandPrice = getBasicPrice("Pasir Beton m3") || 0;
    const gravelPrice = getBasicPrice("Batu kerikil/ koral beton m3") || 0;
    const waterPrice = getBasicPrice("Air Bersih Liter") || 0;

    const rebarPrice =
      getBasicPrice(`Besi Beton Dia.${data.mainRebarSize} mm (SNI)`) || 0;

      const rebarPricePerBar = rebarPrice * 12

    const stirrupPrice =
      getBasicPrice(`Besi Beton Dia.${data.stirrupSize} mm (SNI)`) || 0;

    const platewoodPrice =
      getBasicPrice("Papan Kayu Kelas III, t = 2-5 cm") || 0;

    const volume = (data.length * data.width * data.height) / 10000; // Convert to m3
    const concreteMix = calculator.getConcreteMixture(data.concreteGrade);
    const mainRebarProps = calculator.getRebarProperties(data.mainRebarSize);
    const stirrupProps = calculator.getRebarProperties(data.stirrupSize);

    const mainRebarLength = data.length * data.mainRebarCount;
    const mainRebarWeight = mainRebarProps.weightPerMeter * mainRebarLength;
    const mainRebarBars = Math.ceil(mainRebarLength / 12);

    const stirrupCount =
      Math.ceil(data.length / (data.stirrupSpacing / 1000)) + 1;
    const stirrupPerimeter =
      (2 * (width - 2 * concreteCover) +
        2 * (height - 2 * concreteCover) +
        2 * hookLength) /
      100;
    const stirrupTotalLength = stirrupPerimeter * stirrupCount;
    const stirrupWeight = stirrupProps.weightPerMeter * stirrupTotalLength;
    const stirrupBars = Math.ceil(stirrupTotalLength / 12);

    // const formworkSloof = calculator.calculateFormWorkSloof({
    //   length: data.length,
    //   height: data.height / 100,
    // });

    const formworksWood = calculator.calculateFormwork({
      length: data.length,
      height: data.height / 100,
    });

    const woodFormCost = formworksWood.volume * platewoodPrice;

    const cementSacks = Math.ceil((concreteMix.cement * volume) / 50);

    const cementCost = concreteMix.cement * volume * cementPrice;
    const sandCost = concreteMix.sand * volume * sandPrice;
    const gravelCost = concreteMix.gravel * volume * gravelPrice;
    const waterCost = concreteMix.water * volume * waterPrice;

    const rebarCost = mainRebarBars * rebarPricePerBar;
    const stirrupCost = stirrupWeight * stirrupPrice;

    const totalPrice =
      cementCost +
      sandCost +
      gravelCost +
      waterCost +
      rebarCost +
      stirrupCost +
      woodFormCost;

    console.log(mainRebarBars);

    setResult({
      cost: {
        cementCost: cementCost.toFixed(2),
        sandCost: sandCost.toFixed(2),
        gravelCost: gravelCost.toFixed(2),
        waterCost: waterCost.toFixed(2),
        rebarCost: rebarCost.toFixed(2),
        stirrupCost: stirrupCost.toFixed(2),
        woodFormCost: woodFormCost.toFixed(2),
        totalPrice: totalPrice.toFixed(2),
      },

      concrete: {
        grade: data.concreteGrade,
        volume: volume.toFixed(3),
        cement: {
          weight: (concreteMix.cement * volume).toFixed(2),
          sacks: cementSacks,
        },
        sand: (concreteMix.sand * volume).toFixed(2),
        gravel: (concreteMix.gravel * volume).toFixed(2),
        water: (concreteMix.water * volume).toFixed(2),
      },
      rebar: {
        mainRebar: {
          size: data.mainRebarSize,
          weight: mainRebarWeight.toFixed(2),
          bars: mainRebarBars,
        },
        stirrup: {
          size: data.stirrupSize,
          weight: stirrupWeight.toFixed(2),
          bars: stirrupBars,
          perimeter: stirrupPerimeter.toFixed(2),
        },
      },
      formwork: {
        volume: formworksWood.volume.toFixed(3),
        QTY: formworksWood.QTY,
      },
    });
  };


  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Kalkulator Kebutuhan Sloof</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="length">Panjang Total Sloof (m)</Label>
              <Input
                id="length"
                type="number"
                {...register("length", {
                  required: "Panjang total sloof harus diisi",
                  max: {
                    value: 100,
                    message: "Panjang total sloof tidak boleh lebih dari 100 m",
                  },
                })}
              />
              {errors.length && (
                <p className="text-red-500">{errors.length.message}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="width">Lebar Sloof (cm)</Label>
                <Input
                  id="width"
                  type="number"
                  {...register("width", {
                    required: "Lebar sloof harus diisi",
                    max: {
                      value: 100,
                      message: "Lebar sloof tidak boleh lebih dari 100 cm",
                    },
                  })}
                />
                {errors.width && (
                  <p className="text-red-500">{errors.width.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="height">Tinggi Sloof (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  {...register("height", {
                    required: "Tinggi sloof harus diisi",
                    max: {
                      value: 100,
                      message: "Tinggi sloof tidak boleh lebih dari 100 cm",
                    },
                  })}
                />
                {errors.height && (
                  <p className="text-red-500">{errors.height.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="concreteCover">Selimut Beton (cm)</Label>
                <Input
                  id="concreteCover"
                  type="number"
                  {...register("concreteCover", {
                    required: "Selimut beton harus diisi",
                    max: {
                      value: 10,
                      message: "Selimut beton tidak boleh lebih dari 10 cm",
                    },
                  })}
                />
                {errors.concreteCover && (
                  <p className="text-red-500">{errors.concreteCover.message}</p>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="concreteGrade">Mutu Beton</Label>
              <Controller
                name="concreteGrade"
                control={control}
                rules={{ required: "Mutu beton harus dipilih" }}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih mutu beton" />
                    </SelectTrigger>
                    <SelectContent>
                      {concreteGrades.map((grade) => (
                        <SelectItem key={grade} value={grade}>
                          {grade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.concreteGrade && (
                <p className="text-red-500">{errors.concreteGrade.message}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="mainRebarSize">Ukuran Tulangan Utama</Label>
                <Controller
                  name="mainRebarSize"
                  control={control}
                  rules={{ required: "Ukuran tulangan utama harus dipilih" }}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value?.toString()}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih ukuran" />
                      </SelectTrigger>
                      <SelectContent>
                        {rebarSizes.map((size) => (
                          <SelectItem key={size} value={size.toString()}>
                            {size} mm
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.mainRebarSize && (
                  <p className="text-red-500">{errors.mainRebarSize.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="mainRebarCount">Jumlah Tulangan Utama</Label>
                <Input
                  id="mainRebarCount"
                  type="number"
                  {...register("mainRebarCount", {
                    required: "Jumlah tulangan utama harus diisi",
                    min: { value: 4, message: "Minimal 4 tulangan" },
                  })}
                />
                {errors.mainRebarCount && (
                  <p className="text-red-500">
                    {errors.mainRebarCount.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="stirrupSize">Ukuran Sengkang</Label>
                <Controller
                  name="stirrupSize"
                  control={control}
                  rules={{ required: "Ukuran sengkang harus dipilih" }}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value?.toString()}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih ukuran" />
                      </SelectTrigger>
                      <SelectContent>
                        {rebarSizes.map((size) => (
                          <SelectItem key={size} value={size.toString()}>
                            {size} mm
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.stirrupSize && (
                  <p className="text-red-500">{errors.stirrupSize.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="stirrupSpacing">
                  Jarak Antar Sengkang (mm)
                </Label>
                <Input
                  id="stirrupSpacing"
                  type="number"
                  {...register("stirrupSpacing", {
                    required: "Jarak antar sengkang harus diisi",
                    min: { value: 50, message: "Jarak minimal 50 mm" },
                    max: { value: 300, message: "Jarak maksimal 300 mm" },
                  })}
                />
                {errors.stirrupSpacing && (
                  <p className="text-red-500">
                    {errors.stirrupSpacing.message}
                  </p>
                )}
              </div>
            </div>
            <Button type="submit">Hitung</Button>
          </form>
        </CardContent>
      </Card>

      {result && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Hasil Perhitungan</CardTitle>
          </CardHeader>
          <CardContent>
            <ResultDisplay result={result} />

          
          </CardContent>
          <div className="flex justify-center">
            <Button
              variant={"destructive"}
              className="flex items-center mt-4 mb-4 "
              onClick={() => exportExcelSloof(result)}
            >
              Export To Excel
              <div className="ml-2">
                <Download />
              </div>
            </Button>
          </div>
        </Card>
      )}
      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Error</AlertDialogTitle>
            <AlertDialogDescription>{alertMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowAlert(false)}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SloofCalculatorForm;
