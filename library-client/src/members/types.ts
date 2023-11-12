import { Identifiable, Unidentifiable } from "@/utils/types";

export interface Member extends Identifiable {
    name: string;
    email: string;
    membershipType: string;
    membershipStartYear: number;
}

export interface MemberEditData extends Omit<Unidentifiable<Member>, "membershipStartYear"> {}
