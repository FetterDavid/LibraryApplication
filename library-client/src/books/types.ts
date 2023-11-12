import { Identifiable } from "@/utils/types";
import { CategorisationObject } from "@/categorisation/types";

export interface Book extends Identifiable {
    inventoryNumber: number;
    title: string;
    publicationYear: number;
    publisherId: number;
    authorId: number;
    categoryId: number;
}

export interface BookWithFullInfo extends Book {
    category: CategorisationObject;
    author: CategorisationObject;
    publisher: CategorisationObject;
}

export interface BookEditData {
    categoryId: number | undefined;
    authorId: number | undefined;
    publisherId: number | undefined;
    inventoryNumber: number;
    title: string;
    publicationYear: number;
}
