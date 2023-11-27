import { Link, Navigate, useParams, useSearchParams } from "react-router-dom";
import { LoadingView, LoadingViewContent, LoadingViewError } from "@/utils/components/loading";
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Dialog,
    DialogBody,
    DialogFooter,
    DialogHeader,
    IconButton,
    Rating,
    Spinner,
    Typography
} from "@material-tailwind/react";
import { Book, BookEditData, RatingEditData } from "@/books/types";
import { Fragment, useCallback, useMemo, useState } from "react";
import { createRating, deleteBook, deleteRating, editBook } from "@/books/api";
import { Unidentifiable } from "@/utils/types";
import { displayErrorNotification, displayInfoNotification } from "@/notifications";
import { BookEditLayout, RatingEditLayout } from "@/books/components";
import { useBookDetails, useBookRatings } from "@/books/hooks";
import { useLibraryFromContext } from "@/library/hooks";
import {
    DataTable,
    DataTableActionColumn,
    DataTableDataColumn
} from "@/utils/components/data-table";
import { MaterialSymbol } from "@/utils/components";
import { DestructiveIconButton } from "@/utils/components/inputs";

const PARAM_KEY_MODAL = "modal";
const PARAM_VALUE_MODAL_NEW_RATING = "newRating";

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
                    <Ratings { ...book! } />
                    <NewRatingModal { ...book! } />
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

    const attemptDelete = useCallback(() => {
        deleteBook(props.id)
            .then(() => window.location.reload())
            .catch(displayErrorNotification);
    }, [ props.id ]);

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
                <Button variant="filled" color="red"
                        onClick={ attemptDelete }>
                    Könyv törlése
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
            <hr />
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

function Ratings(props: Book) {
    const [ ratings, loadingRatings ] = useBookRatings(props.id);
    const [ , setSearchParams ] = useSearchParams();

    const openNewRatingModal = useCallback(() => {
        setSearchParams(state => {
            state.set(PARAM_KEY_MODAL, PARAM_VALUE_MODAL_NEW_RATING);
            return state;
        });
    }, [ setSearchParams ]);

    const attemptDelete = useCallback((id: number) => {
        deleteRating(id)
            .then(() => window.location.reload())
            .catch(displayErrorNotification);
    }, []);

    return loadingRatings ? <Spinner /> : (
        <Card>
            <CardHeader floated={ false } shadow={ false } className="m-6">
                <Typography className="text-center select-none" variant="h6">
                    Értékelések
                </Typography>
            </CardHeader>
            <hr />
            <CardBody>
                <DataTable dataList={ ratings } excludedProperties={ [ "id" ] }>
                    <DataTableDataColumn list={ ratings } forKey="reader"
                                         header="Olvasó">
                        { value => (
                            <Link to={ `/members/${ value.id }` }>
                                <Typography variant="small" className="hover:underline">
                                    { value.name }
                                </Typography>
                            </Link>
                        ) }
                    </DataTableDataColumn>
                    <DataTableDataColumn list={ ratings } forKey="point"
                                         header="Értékelés">
                        { value => (
                            <Rating value={ value } readonly />
                        ) }
                    </DataTableDataColumn>
                    <DataTableActionColumn list={ ratings }>
                        { ({ id }) => (
                            <div className="flex flex-row gap-2 items-center">
                                <DestructiveIconButton onClick={ () => attemptDelete(id) }>
                                    <MaterialSymbol name="delete" />
                                </DestructiveIconButton>
                            </div>
                        ) }
                    </DataTableActionColumn>
                </DataTable>
            </CardBody>
            <hr />
            <CardFooter>
                <Button onClick={ openNewRatingModal }>
                    Új értékelés
                </Button>
            </CardFooter>
        </Card>
    );
}

function NewRatingModal(props: Book) {
    const [ searchParams, setSearchParams ] = useSearchParams();

    const [ ratingEditData, setRatingEditData ] = useState<RatingEditData>({
        ...defaultRatingEditData(), inventoryNumber: props.id
    });
    const [ loading, setLoading ] = useState(false);

    const open = useMemo(() => {
        return searchParams.get(PARAM_KEY_MODAL) === PARAM_VALUE_MODAL_NEW_RATING;
    }, [ searchParams ]);
    const setOpen = useCallback((isOpen: boolean) => {
        setSearchParams(prevState => {
            if (isOpen) {
                prevState.set(PARAM_KEY_MODAL, PARAM_VALUE_MODAL_NEW_RATING);
            } else {
                prevState.delete(PARAM_KEY_MODAL);
            }

            return prevState;
        });

        setRatingEditData(defaultRatingEditData);
    }, [ setSearchParams ]);

    const canCreate = useMemo(() => {
        return [ ratingEditData.inventoryNumber, ratingEditData.readerNumber ]
            .every(value => !!value);
    }, [ ratingEditData.inventoryNumber, ratingEditData.readerNumber ]);

    const create = useCallback(() => {
        if (!canCreate) return;

        setLoading(true);
        createRating(ratingEditData)
            .then(() => {
                displayInfoNotification("Könyv hozzáadva.");
                setOpen(false);
                window.location.reload();
            })
            .catch(displayErrorNotification)
            .finally(() => setLoading(false));
    }, [ ratingEditData, canCreate, setOpen ]);

    return (
        <Dialog open={ open } handler={ setOpen }>
            <DialogHeader>
                <Typography variant="lead">
                    Új értékelés
                </Typography>
            </DialogHeader>
            <hr />
            <DialogBody>
                <RatingEditLayout data={ ratingEditData } onData={ setRatingEditData }
                                  disabled="book" />
            </DialogBody>
            <hr />
            <DialogFooter className="flex flex-row items-center justify-end gap-2">
                <Button variant="text" onClick={ () => setOpen(false) }>
                    Mégsem
                </Button>
                <Button variant="filled" disabled={ loading || !canCreate } onClick={ create }>
                    Rögzítés
                </Button>
            </DialogFooter>
        </Dialog>
    );
}

function defaultRatingEditData(): RatingEditData {
    return {
        inventoryNumber: undefined,
        point: 3,
        ratingDate: new Date(),
        readerNumber: undefined,
        comment: ""
    };
}
