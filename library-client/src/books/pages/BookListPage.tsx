import { useLibraryFromContext } from "@/library/hooks";
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Chip,
    Dialog,
    DialogBody,
    DialogFooter,
    DialogHeader,
    IconButton,
    Spinner,
    Typography
} from "@material-tailwind/react";
import {
    DataTable,
    DataTableActionColumn,
    DataTableDataColumn
} from "@/utils/components/data-table";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Book, BookEditData } from "@/books/types";
import { BookEditLayout } from "@/books/components";
import { createBook, editBook } from "@/books/api";
import { Unidentifiable } from "@/utils/types";
import { displayErrorNotification, displayInfoNotification } from "@/notifications";
import { useBookDetails } from "@/books/hooks";
import { MaterialSymbol } from "@/utils/components";

const PARAM_KEY_MODAL = "modal";
const PARAM_VALUE_MODAL_NEW_BOOK = "new-book";
const PARAM_VALUE_MODAL_EDIT_BOOK = "edit-book";
const PARAM_KEY_ID = "id";

export default function BookListPage() {
    const [ , setSearchParams ] = useSearchParams();

    const openModal = useCallback(() => {
        setSearchParams(prevState => {
            prevState.set(PARAM_KEY_MODAL, PARAM_VALUE_MODAL_NEW_BOOK);
            return prevState;
        });
    }, [ setSearchParams ]);

    return (
        <Fragment>
            <Card>
                <CardHeader floated={ false } shadow={ false } className="m-6">
                    <Typography className="text-center select-none" variant="lead">
                        Könyvek
                    </Typography>
                </CardHeader>
                <hr />
                <CardBody>
                    <BooksDataTable />
                </CardBody>
                <hr />
                <CardFooter>
                    <Button variant="filled" onClick={ openModal }>
                        Új könyv felvétele
                    </Button>
                </CardFooter>
            </Card>
            <NewBookModal />
            <EditBookModal />
        </Fragment>
    );
}

function BooksDataTable() {
    const { books } = useLibraryFromContext();
    const [ , setSearchParams ] = useSearchParams();

    const openModal = useCallback((id: number) => {
        setSearchParams(prevState => {
            prevState.set(PARAM_KEY_MODAL, PARAM_VALUE_MODAL_EDIT_BOOK);
            prevState.set(PARAM_KEY_ID, String(id));
            return prevState;
        });
    }, [ setSearchParams ]);

    return (
        <DataTable dataList={ books } excludedProperties={ [ "id" ] }>
            <DataTableDataColumn list={ books } forKey="author"
                                 header="Író"
                                 element={ value => (
                                     <Typography variant="small">
                                         { value.name }
                                     </Typography>
                                 ) } />
            <DataTableDataColumn list={ books } forKey="title"
                                 header="Cím"
                                 element={ value => (
                                     <Typography variant="small" className="font-bold">
                                         { value }
                                     </Typography>
                                 ) } />
            <DataTableDataColumn list={ books } forKey="category"
                                 header="Kategória"
                                 element={ value => (
                                     <Typography variant="small">
                                         { value.name }
                                     </Typography>
                                 ) } />
            <DataTableDataColumn list={ books } forKey="publicationYear"
                                 header="Kiadás éve"
                                 element={ value => (
                                     <Chip value={ value } variant="ghost"
                                           className="w-min" color="deep-purple" />
                                 ) } />
            <DataTableDataColumn list={ books } forKey="publisher"
                                 header="Kiadó"
                                 element={ value => (
                                     <Typography variant="small">
                                         { value.name }
                                     </Typography>
                                 ) } />
            <DataTableActionColumn list={ books } element={ entry => (
                <div className="flex flex-row gap-2">
                    <IconButton variant="text" onClick={ () => openModal(entry.id) }>
                        <MaterialSymbol name="edit" />
                    </IconButton>
                    <IconButton variant="text" color="red">
                        <MaterialSymbol name="delete" />
                    </IconButton>
                </div>
            ) } />
        </DataTable>
    );
}

function NewBookModal() {
    const [ searchParams, setSearchParams ] = useSearchParams();

    const [ bookData, setBookData ] = useState<BookEditData>(defaultBookEditData);
    const [ loading, setLoading ] = useState(false);

    const open = useMemo(() => {
        return searchParams.get(PARAM_KEY_MODAL) === PARAM_VALUE_MODAL_NEW_BOOK;
    }, [ searchParams ]);
    const setOpen = useCallback((isOpen: boolean) => {
        setSearchParams(prevState => {
            if (isOpen) {
                prevState.set(PARAM_KEY_MODAL, PARAM_VALUE_MODAL_NEW_BOOK);
            } else {
                prevState.delete(PARAM_KEY_MODAL);
            }

            return prevState;
        });

        setBookData(defaultBookEditData);
    }, [ setSearchParams ]);

    const canCreate = useMemo(() => {
        return [ bookData.title, bookData.categoryId, bookData.authorId, bookData.publisherId ]
            .every(value => !!value);
    }, [ bookData.authorId, bookData.categoryId, bookData.publisherId, bookData.title ]);

    const create = useCallback(() => {
        if (!canCreate) return;

        setLoading(true);
        createBook(bookData as Unidentifiable<Book>)
            .then(() => {
                displayInfoNotification("Könyv hozzáadva.");
                setOpen(false);
                window.location.reload();
            })
            .catch(displayErrorNotification)
            .finally(() => setLoading(false));
    }, [ bookData, canCreate, setOpen ]);

    return (
        <Dialog open={ open } handler={ setOpen }>
            <DialogHeader>
                <Typography variant="lead">
                    Könyv hozzáadása
                </Typography>
            </DialogHeader>
            <hr />
            <DialogBody>
                <BookEditLayout data={ bookData } onData={ setBookData } />
            </DialogBody>
            <hr />
            <DialogFooter className="flex flex-row items-center justify-end gap-2">
                <Button variant="text" onClick={ () => setOpen(false) }>
                    Mégsem
                </Button>
                <Button variant="filled" disabled={ loading || !canCreate } onClick={ create }>
                    Hozzáadás
                </Button>
            </DialogFooter>
        </Dialog>
    );
}

function EditBookModal() {
    const [ searchParams, setSearchParams ] = useSearchParams();
    const [ book, loadingBook ] = useBookDetails(
        searchParams.has(PARAM_KEY_ID) ? parseInt(searchParams.get(PARAM_KEY_ID)!) : -1
    );

    const [ bookData, setBookData ] = useState<BookEditData>(defaultBookEditData);
    const [ loading, setLoading ] = useState(false);

    const open = useMemo(() => {
        return searchParams.get(PARAM_KEY_MODAL) === PARAM_VALUE_MODAL_EDIT_BOOK;
    }, [ searchParams ]);
    const setOpen = useCallback((isOpen: boolean) => {
        setSearchParams(prevState => {
            if (isOpen) {
                prevState.set(PARAM_KEY_MODAL, PARAM_VALUE_MODAL_EDIT_BOOK);
            } else {
                prevState.delete(PARAM_KEY_MODAL);
                prevState.delete(PARAM_KEY_ID);
            }

            return prevState;
        });

        setBookData(defaultBookEditData);
    }, [ setSearchParams ]);

    const canCreate = useMemo(() => {
        return [ bookData.title, bookData.categoryId, bookData.authorId, bookData.publisherId ]
            .every(value => !!value);
    }, [ bookData.authorId, bookData.categoryId, bookData.publisherId, bookData.title ]);

    const edit = useCallback(() => {
        if (!book || !canCreate) return;

        setLoading(true);
        editBook(book.id, bookData as Unidentifiable<Book>)
            .then(() => {
                displayInfoNotification("Könyv hozzáadva.");
                setOpen(false);
                window.location.reload();
            })
            .catch(displayErrorNotification)
            .finally(() => setLoading(false));
    }, [ book, bookData, canCreate, setOpen ]);

    useEffect(() => {
        if (!!book) setBookData(book);
    }, [ book ]);

    useEffect(() => {
        if (open && !searchParams.has(PARAM_KEY_ID)) setOpen(false);
    }, [ open, searchParams, setOpen ]);

    return (
        <Dialog open={ open } handler={ setOpen }>
            <DialogHeader>
                <Typography variant="lead">
                    Könyv szerkesztése
                </Typography>
            </DialogHeader>
            <hr />
            <DialogBody>
                { loadingBook ? <Spinner /> : (
                    <BookEditLayout data={ bookData } onData={ setBookData } />
                ) }
            </DialogBody>
            <hr />
            <DialogFooter className="flex flex-row items-center justify-end gap-2">
                <Button variant="text" onClick={ () => setOpen(false) }>
                    Mégsem
                </Button>
                <Button variant="filled" disabled={ loading || loadingBook || !book }
                        onClick={ edit }>
                    Szerkesztés
                </Button>
            </DialogFooter>
        </Dialog>
    );
}

function defaultBookEditData(): BookEditData {
    return {
        authorId: undefined,
        categoryId: undefined,
        publicationYear: new Date().getFullYear(),
        publisherId: undefined,
        title: ""
    };
}
