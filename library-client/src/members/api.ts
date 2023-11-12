import { Member, MemberEditData } from "@/members/types";
import { apiRequest } from "@/utils/api";
import { Unidentifiable } from "@/utils/types";

export async function createMember(data: MemberEditData) {
    const membershipStartYear = new Date().getFullYear();
    const temp: Unidentifiable<Member> = { ...data, membershipStartYear };
    delete (temp as any)["readerNumber"];
    return apiRequest("/Member", "POST", temp);
}

export async function editMember(id: number, data: MemberEditData) {
    const membershipStartYear = new Date().getFullYear();
    const temp: Unidentifiable<Member> = { ...data, membershipStartYear };
    return apiRequest(`/Member/${ id }`, "PUT", temp);
}

export async function deleteMember(id: number) {
    return apiRequest(`/Member/${ id }`, "DELETE");
}
