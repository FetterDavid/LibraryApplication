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
    Input,
    Typography
} from "@material-tailwind/react";
import {
    DataTable,
    DataTableActionColumn,
    DataTableDataColumn
} from "@/utils/components/data-table";
import { Fragment, useCallback, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Book, BookEditData } from "@/books/types";
import { BookEditLayout } from "@/books/components";
import { createBook, deleteBook } from "@/books/api";
import { Unidentifiable } from "@/utils/types";
import { displayErrorNotification, displayInfoNotification } from "@/notifications";
import { MaterialSymbol } from "@/utils/components";
import { DestructiveIconButton } from "@/utils/components/inputs";
import { contains } from "@/utils/lib";

const PARAM_KEY_MODAL = "modal";
const PARAM_VALUE_MODAL_NEW_BOOK = "new-book";

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
        </Fragment>
    );
}

function BooksDataTable() {
    const { books } = useLibraryFromContext();

    const [ titleFilter, setTitleFilter ] = useState("");
    const [ authorFilter, setAuthorFilter ] = useState("");
    const [ publisherFilter, setPublisherFilter ] = useState("");

    const filteredBooks = useMemo(() => books.filter(value => (
        (!!titleFilter ? contains(value.title, titleFilter) : true) &&
        (!!authorFilter ? contains(value.author.name, authorFilter) : true) &&
        (!!publisherFilter ? contains(value.publisher.name, publisherFilter) : true)
    )), [ authorFilter, books, publisherFilter, titleFilter ]);

    const attemptDelete = useCallback((id: number) => {
        deleteBook(id)
            .then(() => window.location.reload())
            .catch(displayErrorNotification);
    }, []);

    return (
        <div className="flex flex-col items-stretch gap-2">
            <div className="w-full grid grid-cols-3 gap-2">
                <Input crossOrigin="" value={ titleFilter }
                       onChange={ event => setTitleFilter(event.target.value) }
                       label="Cím" />
                <Input crossOrigin="" value={ authorFilter }
                       onChange={ event => setAuthorFilter(event.target.value) }
                       label="Író" />
                <Input crossOrigin="" value={ publisherFilter }
                       onChange={ event => setPublisherFilter(event.target.value) }
                       label="Kiadó" />
            </div>
            <DataTable dataList={ filteredBooks } excludedProperties={ [ "id" ] }>
                <DataTableDataColumn list={ filteredBooks } forKey="author"
                                     header="Író">
                    { value => (
                        <Typography variant="small">
                            { value.name }
                        </Typography>
                    ) }
                </DataTableDataColumn>
                <DataTableDataColumn list={ filteredBooks } forKey="title"
                                     header="Cím">
                    { value => (
                        <Typography variant="small" className="font-bold">
                            { value }
                        </Typography>
                    ) }
                </DataTableDataColumn>
                <DataTableDataColumn list={ filteredBooks } forKey="category"
                                     header="Kategória">
                    { value => (
                        <Typography variant="small">
                            { value.name }
                        </Typography>
                    ) }
                </DataTableDataColumn>
                <DataTableDataColumn list={ filteredBooks } forKey="publicationYear"
                                     header="Kiadás éve">
                    { value => (
                        <Chip value={ value } variant="ghost"
                              className="w-min" color="deep-purple" />
                    ) }
                </DataTableDataColumn>
                <DataTableDataColumn list={ filteredBooks } forKey="publisher"
                                     header="Kiadó">
                    { value => (
                        <Typography variant="small">
                            { value.name }
                        </Typography>
                    ) }
                </DataTableDataColumn>
                <DataTableActionColumn list={ filteredBooks }>
                    { ({ id }) => (
                        <div className="flex flex-row gap-2">
                            <Link to={ String(id) }>
                                <IconButton variant="text">
                                    <MaterialSymbol name="edit" />
                                </IconButton>
                            </Link>
                            <DestructiveIconButton onClick={ () => attemptDelete(id) }>
                                <MaterialSymbol name="delete" />
                            </DestructiveIconButton>
                        </div>
                    ) }
                </DataTableActionColumn>
            </DataTable>
        </div>
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

function defaultBookEditData(): BookEditData {
    return {
        authorId: undefined,
        categoryId: undefined,
        publicationYear: new Date().getFullYear(),
        publisherId: undefined,
        title: ""
    };
}
