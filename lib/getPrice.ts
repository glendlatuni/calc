import basicPrice from "./../hsb.json";

export default function getBasicPrice(materialName : string): number | null {
    const material = basicPrice.find(m=>m["Nama Bahan"].toLocaleLowerCase()===materialName.toLocaleLowerCase());

    return material ? material["Harga Dasar"] : null;
}