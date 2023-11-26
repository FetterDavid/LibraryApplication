import { BookAcquisition, BookAcquisitionWithBook } from "@/acquisitions/types";
import { useEffect, useState } from "react";
import { apiRequest } from "@/utils/api";
import { displayErrorNotification } from "@/notifications";
import { getBook } from "@/books/api";

export function useAcquisitionList(): [ BookAcquisition[], boolean ] {
    const [ list, setList ] = useState<BookAcquisition[]>([]);
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        apiRequest<BookAcquisition[]>("/BookAcquisition", "GET")
            .then(acqs => setList(acqs.map(a => {
                return {
                    ...a,
                    bookId: (a as any)["inventoryNumber"],
                    acquisitionDate: new Date(a.acquisitionDate)
                };
            })))
            .catch(displayErrorNotification)
            .finally(() => setLoading(false));
    }, []);

    return [ list, loading ];
}

export function useAcquisitionDetails(
    id: number
): [ BookAcquisitionWithBook | undefined, boolean ] {
    const [ details, setDetails ] = useState<BookAcquisitionWithBook>();
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        if (id < 0) {
            setLoading(false);
            setDetails(undefined);
            return;
        }

        apiRequest<BookAcquisition>(`/BookAcquisition/${ id }`, "GET")
            .then(acq => ({
                ...acq,
                bookId: (acq as any)["inventoryNumber"],
                acquisitionDate: new Date(acq.acquisitionDate)
            }))
            .then(async acq => setDetails({ ...acq, book: await getBook(acq.bookId) }))
            .catch(displayErrorNotification)
            .finally(() => setLoading(false));
    }, [ id ]);

    return [ details, loading ];
}
