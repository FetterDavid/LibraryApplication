import { BookWithFullInfo } from "@/books/types";
import { CategorisationObject } from "@/categorisation/types";
import { Member } from "@/members/types";

export interface Library {
    books: BookWithFullInfo[];
    categories: CategorisationObject[];
    authors: CategorisationObject[];
    publishers: CategorisationObject[];
    members: Member[];
}
