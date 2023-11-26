import { BookWithFullInfo } from "@/books/types";
import { CategorisationObject } from "@/categorisation/types";
import { Member } from "@/members/types";
import { BookAcquisition } from "@/acquisitions/types";

export interface Library {
    books: BookWithFullInfo[];
    categories: CategorisationObject[];
    authors: CategorisationObject[];
    publishers: CategorisationObject[];
    members: Member[];
    acquisitions: BookAcquisition[];
}
