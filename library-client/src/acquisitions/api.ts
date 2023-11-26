import { AcquisitionEditData } from "@/acquisitions/types";
import { apiRequest } from "@/utils/api";

export async function createAcquisition(data: AcquisitionEditData) {
    const temp = { ...data };
    (temp as any)["inventoryNumber"] = temp.bookId;
    delete (temp as any)["bookId"];
    delete (temp as any)["id"];

    await apiRequest("/BookAcquisition", "POST", temp);
}

export async function editAcquisition(id: number, data: AcquisitionEditData) {
    const temp = { ...data };
    (temp as any)["inventoryNumber"] = temp.bookId;
    delete (temp as any)["bookId"];

    await apiRequest(`/BookAcquisition/${ id }`, "PUT", temp);
}

export async function deleteAcquisition(id: number) {
    await apiRequest(`/BookAcquisition/${ id }`, "DELETE");
}
