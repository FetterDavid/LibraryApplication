import { Identifiable, Override, Unidentifiable } from "@/utils/types";
import { Member } from "@/members/types";
import { BookWithFullInfo } from "@/books/types";

export interface Borrowing extends Identifiable {
    readerNumber: number;
    inventoryNumber: number;
    lateFee: number;
    borrowDate: Date;
    returnDate: Date;
}

export interface BorrowingWithFullInfo extends Borrowing {
    reader: Member;
    book: BookWithFullInfo;
}

export interface BorrowingEditData extends Override<Unidentifiable<Borrowing>, {
    readerNumber: number | undefined
    inventoryNumber: number | undefined
}> {}
