import { useEffect, useState } from "react";
import { Book, BookWithFullInfo } from "@/books/types";
import { apiRequest } from "@/utils/api";
import { displayErrorNotification } from "@/notifications";
import { CategorisationObject } from "@/categorisation/types";
import { getBook } from "@/books/api";

export function useBookList(): [ BookWithFullInfo[], boolean ] {
    const [ list, setList ] = useState<BookWithFullInfo[]>([]);
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        apiRequest<Book[]>("/Book", "GET")
            .then(async books => {
                const categorisationData = await Promise.all(books.map(b => {
                    return Promise.all([ `/Category/${ b.categoryId }`, `/Author/${ b.authorId }`,
                        `/Publisher/${ b.publisherId }` ].map(endpoint => {
                        return apiRequest<CategorisationObject>(endpoint, "GET");
                    }));
                }));
                setList(books.map((b, i) => {
                    return {
                        ...b,
                        id: (b as any)["inventoryNumber"],
                        category: categorisationData[i][0],
                        author: categorisationData[i][1],
                        publisher: categorisationData[i][2]
                    };
                }));
            })
            .catch(displayErrorNotification)
            .finally(() => setLoading(false));
    }, []);

    return [ list, loading ];
}

export function useBookDetails(id: number): [ BookWithFullInfo | undefined, boolean ] {
    const [ data, setData ] = useState<BookWithFullInfo>();
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        if (id < 0) {
            setLoading(false);
            return;
        }

        getBook(id)
            .then(setData)
            .catch(displayErrorNotification)
            .finally(() => setLoading(false));
    }, [ id ]);

    return [ data, loading ];
}
