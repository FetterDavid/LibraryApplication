import { Member } from "@/members/types";
import { useEffect, useState } from "react";
import { apiRequest } from "@/utils/api";
import { displayErrorNotification } from "@/notifications";

export function useMemberList(): [ Member[], boolean ] {
    const [ list, setList ] = useState<Member[]>([]);
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        apiRequest<Member[]>("/Member", "GET")
            .then(members => {
                setList(members.map(m => {
                    return { ...m, id: (m as any)["readerNumber"] };
                }));
            })
            .catch(displayErrorNotification)
            .finally(() => setLoading(false));
    }, []);

    return [ list, loading ];
}

export function useMemberDetails(id: number): [ Member | undefined, boolean ] {
    const [ data, setData ] = useState<Member>();
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        if (id < 0) {
            setLoading(false);
            setData(undefined);
            return;
        }

        apiRequest<Member>(`/Member/${ id }`, "GET")
            .then(book => {
                setData({ ...book, id: (book as any)["readerNumber"] });
            })
            .catch(displayErrorNotification)
            .finally(() => setLoading(false));
    }, [ id ]);

    return [ data, loading ];
}
