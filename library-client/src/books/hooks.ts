import { useEffect, useState } from "react";
import { Book, BookWithFullInfo, Rating, RatingWithFullInfo } from "@/books/types";
import { apiRequest } from "@/utils/api";
import { displayErrorNotification } from "@/notifications";
import { CategorisationObject } from "@/categorisation/types";
import { getBook } from "@/books/api";
import { getMember } from "@/members/api";

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
            setData(undefined);
            return;
        }

        getBook(id)
            .then(setData)
            .catch(displayErrorNotification)
            .finally(() => setLoading(false));
    }, [ id ]);

    return [ data, loading ];
}

export function useBookRatings(id: number): [ RatingWithFullInfo[], boolean ] {
    const [ list, setList ] = useState<RatingWithFullInfo[]>([]);
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        apiRequest<Rating[]>("/Rating", "GET")
            .then(ratings => ratings.filter(value => value.inventoryNumber === id))
            .then(async ratings => {
                const out: RatingWithFullInfo[] = [];
                for (const r of ratings) {
                    out.push({
                        ...r,
                        reader: await getMember(r.readerNumber),
                        book: await getBook(r.inventoryNumber),
                        ratingDate: new Date(r.ratingDate)
                    });
                }
                return out;
            })
            .then(setList)
            .catch(displayErrorNotification)
            .finally(() => setLoading(false));
    }, [ id ]);

    return [ list, loading ];
}

export function useMemberBookRatings(id: number): [ RatingWithFullInfo[], boolean ] {
    const [ list, setList ] = useState<RatingWithFullInfo[]>([]);
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        apiRequest<Rating[]>("/Rating", "GET")
            .then(ratings => ratings.filter(value => value.readerNumber === id))
            .then(async ratings => {
                const out: RatingWithFullInfo[] = [];
                for (const r of ratings) {
                    out.push({
                        ...r,
                        reader: await getMember(r.readerNumber),
                        book: await getBook(r.inventoryNumber),
                        ratingDate: new Date(r.ratingDate)
                    });
                }
                return out;
            })
            .then(setList)
            .catch(displayErrorNotification)
            .finally(() => setLoading(false));
    }, [ id ]);

    return [ list, loading ];
}
