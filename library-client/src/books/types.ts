import { Identifiable } from "@/utils/types";

export interface Book extends Identifiable {
    inventoryNumber: number;
    title: string;
    publicationYear: number;
    publisherId: number;
    authorId: number;
    categoryId: number;
}
