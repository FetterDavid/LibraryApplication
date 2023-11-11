import { Book } from "@/books/types";
import { CategorisationObject } from "@/categorisation/types";

export interface Library {
    books: Book[];
    categories: CategorisationObject[];
    authors: CategorisationObject[];
    publishers: CategorisationObject[];
}
