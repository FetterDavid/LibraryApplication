import { Identifiable } from "@/utils/types";
import { Library } from "@/library/types";

export interface CategorisationObject extends Identifiable {
    name: string;
}

export type CategorisationType = keyof Omit<
    Library, "books" | "acquisitions" | "members" | "borrowings"
>
