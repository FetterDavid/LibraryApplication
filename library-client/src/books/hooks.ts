import { useEffect, useState } from "react";
import { Book, BookWithFullInfo } from "@/books/types";
import { apiRequest } from "@/utils/api";
import { displayErrorNotification } from "@/notifications";
import { CategorisationObject } from "@/categorisation/types";

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

        apiRequest<Book>(`/Book/${ id }`, "GET")
            .then(async book => {
                const categorisationData = await Promise.all([ `/Category/${ book.categoryId }`,
                    `/Author/${ book.authorId }`,
                    `/Publisher/${ book.publisherId }` ].map(endpoint => {
                    return apiRequest<CategorisationObject>(endpoint, "GET");
                }));
                setData({
                    ...book,
                    category: categorisationData[0],
                    author: categorisationData[1],
                    publisher: categorisationData[2]
                });
            })
            .catch(displayErrorNotification)
            .finally(() => setLoading(false));
    }, [ id ]);

    return [ data, loading ];
}
