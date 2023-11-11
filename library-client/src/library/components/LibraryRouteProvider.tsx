import { useBookList } from "@/books/hooks";
import { LoadingView, LoadingViewContent, LoadingViewError } from "@/utils/components/loading";
import { Outlet } from "react-router-dom";
import { LibraryContext } from "@/contexts";

export function LibraryRouteProvider() {
    const [ books, loadingBooks ] = useBookList();

    return (
        <LoadingView condition={ loadingBooks }>
            <LoadingViewError condition={ books === undefined }>
                :(
            </LoadingViewError>
            <LoadingViewContent>
                <LibraryContext.Provider value={ {
                    books: books
                } }>
                    <Outlet />
                </LibraryContext.Provider>
            </LoadingViewContent>
        </LoadingView>
    );
}
