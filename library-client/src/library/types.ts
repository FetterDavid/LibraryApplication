import { BookWithFullInfo } from "@/books/types";
import { CategorisationObject } from "@/categorisation/types";

export interface Library {
    books: BookWithFullInfo[];
    categories: CategorisationObject[];
    authors: CategorisationObject[];
    publishers: CategorisationObject[];
}
