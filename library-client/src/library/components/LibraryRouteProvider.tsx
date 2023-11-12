import { useBookList } from "@/books/hooks";
import { LoadingView, LoadingViewContent, LoadingViewError } from "@/utils/components/loading";
import { Outlet } from "react-router-dom";
import { LibraryContext } from "@/library";
import { useMemo } from "react";
import { useCategorisationObjectList } from "@/categorisation/hooks";
import { useMemberList } from "@/members/hooks";

export function LibraryRouteProvider() {
    const [ books, loadingBooks ] = useBookList();
    const [ categories, loadingCategories ] = useCategorisationObjectList("categories");
    const [ authors, loadingAuthors ] = useCategorisationObjectList("authors");
    const [ publishers, loadingPublishers ] = useCategorisationObjectList("publishers");
    const [ members, loadingMembers ] = useMemberList();

    const loading = useMemo(() => {
        return loadingBooks || loadingCategories || loadingAuthors || loadingPublishers ||
            loadingMembers;
    }, [ loadingAuthors, loadingBooks, loadingCategories, loadingMembers, loadingPublishers ]);

    const error = useMemo(() => {
        return ![ books, categories, authors, publishers, members ]
            .every(value => value !== undefined);
    }, [ authors, books, categories, members, publishers ]);

    return (
        <LoadingView condition={ loading }>
            <LoadingViewError condition={ error }>
                :(
            </LoadingViewError>
            <LoadingViewContent>
                <LibraryContext.Provider value={
                    { books, categories, authors, publishers, members }
                }>
                    <Outlet />
                </LibraryContext.Provider>
            </LoadingViewContent>
        </LoadingView>
    );
}
