import { Identifiable, Override, Unidentifiable } from "@/utils/types";
import { CategorisationObject } from "@/categorisation/types";
import { Member } from "@/members/types";

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

export interface Rating extends Identifiable {
    readerNumber: number;
    inventoryNumber: number;
    point: number;
    comment: string;
    ratingDate: Date;
}

export interface RatingWithFullInfo extends Rating {
    reader: Member;
    book: Book;
}

export interface RatingEditData extends Override<Unidentifiable<Rating>, {
    readerNumber: number | undefined
    inventoryNumber: number | undefined
}> {}
