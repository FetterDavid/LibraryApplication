import { Unidentifiable } from "@/utils/types";
import { Book } from "@/books/types";
import { apiRequest } from "@/utils/api";

export async function createBook(data: Unidentifiable<Book>) {
    return apiRequest("/Book", "POST", data);
}

export async function editBook(id: number, data: Unidentifiable<Book>) {
    return apiRequest(`/Book/${ id }`, "PUT", data);
}
