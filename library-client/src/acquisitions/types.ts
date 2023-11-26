import { Identifiable, Override, Unidentifiable } from "@/utils/types";
import { BookWithFullInfo } from "@/books/types";

export interface BookAcquisition extends Identifiable {
    bookId: number;
    acquisitionDate: Date;
    price: number;
    acquisitionSource: string;
}

export interface BookAcquisitionWithBook extends BookAcquisition {
    book: BookWithFullInfo;
}

export interface AcquisitionEditData extends Override<Unidentifiable<BookAcquisition>, {
    bookId: number | undefined
}> {}
