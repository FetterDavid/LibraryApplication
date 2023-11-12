import { Unidentifiable } from "@/utils/types";
import { Book } from "@/books/types";
import { apiRequest } from "@/utils/api";

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
