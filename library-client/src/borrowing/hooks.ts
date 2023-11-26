import { useEffect, useState } from "react";
import { apiRequest } from "@/utils/api";
import { displayErrorNotification } from "@/notifications";
import { getBook } from "@/books/api";
import { Borrowing, BorrowingWithFullInfo } from "@/borrowing/types";
import { getMember } from "@/members/api";

export function useBorrowList(): [ BorrowingWithFullInfo[], boolean ] {
    const [ list, setList ] = useState<BorrowingWithFullInfo[]>([]);
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        apiRequest<Borrowing[]>("/Borrowing", "GET")
            .then(bs => bs.map(b => ({
                ...b,
                returnDate: new Date(b.returnDate),
                borrowDate: new Date(b.borrowDate)
            })))
            .then(async bs => {
                const out: BorrowingWithFullInfo[] = [];

                for (const b of bs) {
                    out.push({
                        ...b,
                        reader: await getMember(b.readerNumber),
                        book: await getBook(b.inventoryNumber)
                    });
                }

                return out;
            })
            .then(setList)
            .catch(displayErrorNotification)
            .finally(() => setLoading(false));
    }, []);

    return [ list, loading ];
}

export function useBorrowingDetails(
    id: number
): [ BorrowingWithFullInfo | undefined, boolean ] {
    const [ details, setDetails ] = useState<BorrowingWithFullInfo>();
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        if (id < 0) {
            setLoading(false);
            setDetails(undefined);
            return;
        }

        apiRequest<Borrowing>(`/Borrowing/${ id }`, "GET")
            .then(b => ({
                ...b,
                returnDate: new Date(b.returnDate),
                borrowDate: new Date(b.borrowDate)
            }))
            .then(async b => setDetails({
                ...b,
                book: await getBook(b.inventoryNumber),
                reader: await getMember(b.readerNumber)
            }))
            .catch(displayErrorNotification)
            .finally(() => setLoading(false));
    }, [ id ]);

    return [ details, loading ];
}
