import { CategorisationType } from "@/categorisation/types";

export function categorisationTypeToEndpoint(type: CategorisationType): string {
    switch (type) {
        case "publishers":
            return "/Publisher";
        case "authors":
            return "/Author";
        case "categories":
            return "/Category";
        default:
            throw new Error("Érvénytelen típus");
    }
}

export function categorisationTypeName(type: CategorisationType): string {
    switch (type) {
        case "authors":
            return "Író";
        case "categories":
            return "Kategória";
        case "publishers":
            return "Kiadó";
        default:
            throw new Error("Érvénytelen típus");
    }
}
