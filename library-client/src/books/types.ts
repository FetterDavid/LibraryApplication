import { Identifiable, Override, Unidentifiable } from "@/utils/types";
import { CategorisationObject } from "@/categorisation/types";

export interface Book extends Identifiable {
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

export interface BookEditData extends Override<Unidentifiable<Book>, {
    categoryId: number | undefined
    authorId: number | undefined;
    publisherId: number | undefined;
}> {}
