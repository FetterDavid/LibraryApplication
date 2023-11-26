import { Link, Navigate, useParams } from "react-router-dom";
import { LoadingView, LoadingViewContent, LoadingViewError } from "@/utils/components/loading";
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    IconButton,
    Typography
} from "@material-tailwind/react";
import { Book, BookEditData } from "@/books/types";
import { Fragment, useCallback, useMemo, useState } from "react";
import { editBook } from "@/books/api";
import { Unidentifiable } from "@/utils/types";
import { displayErrorNotification, displayInfoNotification } from "@/notifications";
import { BookEditLayout } from "@/books/components";
import { useBookDetails } from "@/books/hooks";
import { useLibraryFromContext } from "@/library/hooks";
import {
    DataTable,
    DataTableActionColumn,
    DataTableDataColumn
} from "@/utils/components/data-table";
import { MaterialSymbol } from "@/utils/components";

export default function BookDetailsPage() {
    const { id: bookId } = useParams();
    const [ book, loadingBook ] = useBookDetails(bookId ? parseInt(bookId) : -1);

    return (
        <LoadingView condition={ loadingBook }>
            <LoadingViewError condition={ !book }>
                <Navigate to=".." relative="path" />
            </LoadingViewError>
            <LoadingViewContent>
                <div className="flex flex-col items-stretch gap-4">
                    <Card>
                        <CardHeader floated={ false } shadow={ false } className="m-6">
                            { !!book && (
                                <Typography className="text-center select-none" variant="lead">
                                    { book.title }
                                </Typography>
                            ) }
                        </CardHeader>
                        <BookDetailsEditor { ...book! } />
                    </Card>
                    <BorrowHistory { ...book! } />
                </div>
            </LoadingViewContent>
        </LoadingView>
    );
}

function BookDetailsEditor(props: Book) {
    const [ bookData, setBookData ] = useState<BookEditData>(props);
    const [ loading, setLoading ] = useState(false);

    const canCreate = useMemo(() => {
        return [ bookData.title, bookData.categoryId, bookData.authorId, bookData.publisherId ]
            .every(value => !!value);
    }, [ bookData.authorId, bookData.categoryId, bookData.publisherId, bookData.title ]);

    const edit = useCallback(() => {
        if (!props || !canCreate) return;

        setLoading(true);
        editBook(props.id, bookData as Unidentifiable<Book>)
            .then(() => {
                displayInfoNotification("Könyv hozzáadva.");
                window.location.reload();
            })
            .catch(displayErrorNotification)
            .finally(() => setLoading(false));
    }, [ props, bookData, canCreate ]);

    return (
        <Fragment>
            <hr />
            <CardBody>
                <BookEditLayout data={ bookData } onData={ setBookData } />
            </CardBody>
            <hr />
            <CardFooter className="flex flex-row items-center justify-end gap-2">
                <Button variant="filled" disabled={ loading }
                        onClick={ edit }>
                    Változtatások mentése
                </Button>
            </CardFooter>
        </Fragment>
    );
}

function BorrowHistory(props: Book) {
    const { borrowings } = useLibraryFromContext();
    const bookBorrowings = useMemo(() => {
        return borrowings.filter(value => value.inventoryNumber === props.id);
    }, [ borrowings, props.id ]);

    return (
        <Card>
            <CardHeader floated={ false } shadow={ false } className="m-6">
                <Typography className="text-center select-none" variant="h6">
                    Kölcsönzések
                </Typography>
            </CardHeader>
            <CardBody>
                <DataTable dataList={ bookBorrowings } excludedProperties={ [ "id" ] }>
                    <DataTableDataColumn list={ bookBorrowings } forKey="reader"
                                         header="Könyv">
                        { value => (
                            <Link to={ `/members/${ value.id }` }>
                                <Typography variant="small" className="hover:underline">
                                    { value.name }
                                </Typography>
                            </Link>
                        ) }
                    </DataTableDataColumn>
                    <DataTableDataColumn list={ bookBorrowings } forKey="borrowDate"
                                         header="Kölcsönzés dátuma">
                        { value => (
                            <Typography variant="small">
                                { value.toLocaleDateString() }
                            </Typography>
                        ) }
                    </DataTableDataColumn>
                    <DataTableActionColumn list={ bookBorrowings }>
                        { ({ id }) => (
                            <Link to={ `/borrowing?modal=borrowing&id=${ id }` }>
                                <IconButton variant="text">
                                    <MaterialSymbol name="open_in_new" />
                                </IconButton>
                            </Link>
                        ) }
                    </DataTableActionColumn>
                </DataTable>
            </CardBody>
        </Card>
    );
}
