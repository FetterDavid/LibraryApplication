import { useEffect, useState } from "react";
import { Book } from "@/books/types";
import { apiRequest } from "@/utils/api";
import { displayErrorNotification } from "@/notifications";

export function useBookList(): [ Book[], boolean ] {
    const [ list, setList ] = useState<Book[]>([]);
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        apiRequest<Book[]>("/Book", "GET")
            .then(setList)
            .catch(displayErrorNotification)
            .finally(() => setLoading(false));
    }, []);

    return [ list, loading ];
}

export function useBookDetails(id: string): [ Book | undefined, boolean ] {
    const [ data, setData ] = useState<Book>();
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        apiRequest<Book>(`/Book/${ id }`, "GET")
            .then(setData)
            .catch(displayErrorNotification)
            .finally(() => setLoading(false));
    }, [ id ]);

    return [ data, loading ];
}
