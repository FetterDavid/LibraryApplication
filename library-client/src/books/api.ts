import { Unidentifiable } from "@/utils/types";
import { Book, BookWithFullInfo, RatingEditData } from "@/books/types";
import { apiRequest } from "@/utils/api";
import { CategorisationObject } from "@/categorisation/types";

export async function createBook(data: Unidentifiable<Book>) {
    const temp = { ...data };
    delete (temp as any)["inventoryData"];
    return apiRequest("/Book", "POST", temp);
}

export async function editBook(id: number, data: Unidentifiable<Book>) {
    const temp = { ...data };
    delete (temp as any)["inventoryData"];
    return apiRequest(`/Book/${ id }`, "PUT", temp);
}

export async function deleteBook(id: number) {
    return apiRequest(`/Book/${ id }`, "DELETE");
}

export async function getBook(id: number) {
    const book = await apiRequest<Book>(`/Book/${ id }`, "GET");
    const categorisationData = await Promise.all([ `/Category/${ book.categoryId }`,
        `/Author/${ book.authorId }`,
        `/Publisher/${ book.publisherId }` ].map(endpoint => {
        return apiRequest<CategorisationObject>(endpoint, "GET");
    }));

    return {
        ...book,
        id: (book as any)["inventoryNumber"],
        category: categorisationData[0],
        author: categorisationData[1],
        publisher: categorisationData[2]
    };
}

export async function searchBooks(
    title: string, isAvailable: boolean
): Promise<BookWithFullInfo[]> {
    const params = new URLSearchParams({
        "Text": title,
        "IsAvailable": String(isAvailable),
        "OrderBy": "TitleAsc"
    });

    const books = await apiRequest<Book[]>(`/Book/search?${ params }`, "GET");
    const out: BookWithFullInfo[] = [];

    for (const b of books) {
        const categorisationData = await Promise.all([ `/Category/${ b.categoryId }`,
            `/Author/${ b.authorId }`,
            `/Publisher/${ b.publisherId }` ].map(endpoint => {
            return apiRequest<CategorisationObject>(endpoint, "GET");
        }));

        out.push({
            ...b,
            id: (b as any)["inventoryNumber"],
            category: categorisationData[0],
            author: categorisationData[1],
            publisher: categorisationData[2]
        });
    }

    return out;
}

export async function createRating(data: RatingEditData) {
    return apiRequest("/Rating", "POST", data);
}

export async function editRating(id: number, data: RatingEditData) {
    return apiRequest(`/Rating/${ id }`, "PUT", data);
}

export async function deleteRating(id: number) {
    return apiRequest(`/Rating/${ id }`, "DELETE");
}
