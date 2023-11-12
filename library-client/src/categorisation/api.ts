import { CategorisationType } from "@/categorisation/types";
import { apiRequest } from "@/utils/api";
import { categorisationTypeToEndpoint } from "@/categorisation/index";

export async function createCategorizationObject(type: CategorisationType, name: string) {
    return apiRequest(categorisationTypeToEndpoint(type), "POST", { name });
}

export async function editCategorisationObject(type: CategorisationType, id: number, name: string) {
    const path = `${ categorisationTypeToEndpoint(type) }/${ id }`;
    return apiRequest(path, "PUT", { id, name });
}
