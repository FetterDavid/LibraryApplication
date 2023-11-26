import { useEffect, useState } from "react";
import { apiRequest } from "@/utils/api";
import { displayErrorNotification } from "@/notifications";
import { CategorisationObject, CategorisationType } from "@/categorisation/types";

function typeToEndpoint(type: CategorisationType) {
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

export function useCategorisationObjectList(
    type: CategorisationType
): [ CategorisationObject[], boolean ] {
    const [ list, setList ] = useState<CategorisationObject[]>([]);
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        apiRequest<CategorisationObject[]>(typeToEndpoint(type), "GET")
            .then(setList)
            .catch(displayErrorNotification)
            .finally(() => setLoading(false));
    }, [ type ]);

    return [ list, loading ];
}

export function useCategorisationObjectDetails(
    type: CategorisationType, id: number
): [ CategorisationObject | undefined, boolean ] {
    const [ data, setData ] = useState<CategorisationObject>();
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        if (id < 0) {
            setLoading(false);
            setData(undefined);
            return;
        }

        apiRequest<CategorisationObject>(`${ typeToEndpoint(type) }/${ id }`, "GET")
            .then(setData)
            .catch(displayErrorNotification)
            .finally(() => setLoading(false));
    }, [ id, type ]);

    return [ data, loading ];
}
