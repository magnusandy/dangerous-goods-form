import { Optional } from "java8script";

export interface ExplosiveData {
    unNumber: string;
    technicalName: string;
    primaryClass: string;
    packingGroup: string;
    perItemWeight: number;
    weightUnit: "kg" | "g";
    description: string;
}
const data: ExplosiveData[] = [
    {
        unNumber: "UN0042",
        technicalName: "BOOSTERS, without detonators",
        primaryClass: "1.1D",
        packingGroup: "II",
        perItemWeight: 0.453592,
        weightUnit: "kg",
        description: "Rock Crusher 1lb"
    },
    {
        unNumber: "UN0042",
        technicalName: "BOOSTERS, without detonators",
        primaryClass: "1.1D",
        packingGroup: "II",
        perItemWeight: 0.907185,
        weightUnit: "kg",
        description: "Rock Crusher 2lb"
    },
    {
        unNumber: "UN0360",
        technicalName: "DETONATOR ASSEMBLIES, NON ELECTRIC",
        primaryClass: "1.1B",
        packingGroup: "II",
        perItemWeight: 0.5,
        weightUnit: "g",
        description: "In-Hole delay"
    }
]

export class ExplosiveRepository {
    public static getDescriptions(): string[] {
        return data.map(d => d.description);
    }

    public static getByDescription(desc: string): Optional<ExplosiveData> {
        return Optional.ofNullable(data.find(d => d.description === desc));
    }
}