import { useBookList } from "@/books/hooks";
import { LoadingView, LoadingViewContent, LoadingViewError } from "@/utils/components/loading";
import { Outlet } from "react-router-dom";
import { LibraryContext } from "@/library";
import { useMemo } from "react";
import { useCategorisationObjectList } from "@/categorisation/hooks";
import { useMemberList } from "@/members/hooks";
import { useAcquisitionList } from "@/acquisitions/hooks";

export default function LibraryRouteProvider() {
    const [ books, loadingBooks ] = useBookList();
    const [ categories, loadingCategories ] = useCategorisationObjectList("categories");
    const [ authors, loadingAuthors ] = useCategorisationObjectList("authors");
    const [ publishers, loadingPublishers ] = useCategorisationObjectList("publishers");
    const [ members, loadingMembers ] = useMemberList();
    const [ acquisitions, loadingAcquisitions ] = useAcquisitionList();

    const loading = useMemo(() => {
        return loadingBooks || loadingCategories || loadingAuthors || loadingPublishers ||
            loadingMembers || loadingAcquisitions;
    }, [ loadingAcquisitions, loadingAuthors, loadingBooks,
        loadingCategories, loadingMembers, loadingPublishers ]);

    const error = useMemo(() => {
        return ![ books, categories, authors, publishers, members, acquisitions ]
            .every(value => value !== undefined);
    }, [ acquisitions, authors, books, categories, members, publishers ]);

    return (
        <LoadingView condition={ loading }>
            <LoadingViewError condition={ error }>
                :(
            </LoadingViewError>
            <LoadingViewContent>
                <LibraryContext.Provider value={
                    { books, categories, authors, publishers, members, acquisitions }
                }>
                    <Outlet />
                </LibraryContext.Provider>
            </LoadingViewContent>
        </LoadingView>
    );
}
