import { apiRequest } from "@/utils/api";
import { BorrowingEditData } from "@/borrowing/types";

export async function createBorrowing(data: BorrowingEditData) {
    const temp = { ...data };
    delete (temp as any)["id"];

    await apiRequest("/Borrowing", "POST", temp);
}

export async function editBorrowing(id: number, data: BorrowingEditData) {
    await apiRequest(`/Borrowing/${ id }`, "PUT", data);
}

export async function deleteBorrowing(id: number) {
    await apiRequest(`/Borrowing/${ id }`, "DELETE");
}
