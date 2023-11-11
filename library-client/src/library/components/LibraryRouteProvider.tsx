import { useBookList } from "@/books/hooks";
import { LoadingView, LoadingViewContent, LoadingViewError } from "@/utils/components/loading";
import { Outlet } from "react-router-dom";
import { LibraryContext } from "@/library";
import { useMemo } from "react";
import { useCategorisationObjectList } from "@/categorisation/hooks";

export function LibraryRouteProvider() {
    const [ books, loadingBooks ] = useBookList();
    const [ categories, loadingCategories ] = useCategorisationObjectList("categories");
    const [ authors, loadingAuthors ] = useCategorisationObjectList("authors");
    const [ publishers, loadingPublishers ] = useCategorisationObjectList("publishers");

    const loading = useMemo(() => {
        return loadingBooks || loadingCategories || loadingAuthors || loadingPublishers;
    }, [ loadingAuthors, loadingBooks, loadingCategories, loadingPublishers ]);

    const error = useMemo(() => {
        return ![ books, categories, authors, publishers ].every(value => value !== undefined);
    }, [ authors, books, categories, publishers ]);

    return (
        <LoadingView condition={ loading }>
            <LoadingViewError condition={ error }>
                :(
            </LoadingViewError>
            <LoadingViewContent>
                <LibraryContext.Provider value={ { books, categories, authors, publishers } }>
                    <Outlet />
                </LibraryContext.Provider>
            </LoadingViewContent>
        </LoadingView>
    );
}
