import { Link, useSearchParams } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
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
    Spinner,
    Typography
} from "@material-tailwind/react";
import { useLibraryFromContext } from "@/library/hooks";
import { displayErrorNotification } from "@/notifications";
import {
    DataTable,
    DataTableActionColumn,
    DataTableDataColumn
} from "@/utils/components/data-table";
import { MaterialSymbol } from "@/utils/components";
import { createBorrowing, deleteBorrowing, editBorrowing } from "@/borrowing/api";
import { useBorrowingDetails } from "@/borrowing/hooks";
import { BorrowingEditData } from "@/borrowing/types";
import { BorrowingEditLayout } from "@/borrowing/components";

const PARAM_KEY_MODAL = "modal";
const PARAM_VALUE_MODAL_BORROWING = "borrowing";
const PARAM_KEY_ID = "id";

export default function BorrowingPage() {
    const [ , setSearchParams ] = useSearchParams();

    const openModal = useCallback(() => {
        setSearchParams(prevState => {
            prevState.set(PARAM_KEY_MODAL, PARAM_VALUE_MODAL_BORROWING);
            return prevState;
        });
    }, [ setSearchParams ]);

    return (
        <Card>
            <CardHeader floated={ false } shadow={ false } className="m-6">
                <Typography className="text-center select-none" variant="lead">
                    Kölcsönzések
                </Typography>
            </CardHeader>
            <hr />
            <CardBody>
                <BorrowingsDataTable />
            </CardBody>
            <hr />
            <CardFooter>
                <Button variant="filled" onClick={ openModal }>
                    Új könyv kiadása
                </Button>
            </CardFooter>
            <BorrowingModal />
        </Card>
    );
}

function BorrowingsDataTable() {
    const { borrowings } = useLibraryFromContext();
    const [ , setSearchParams ] = useSearchParams();

    const openModal = useCallback((id: number) => {
        setSearchParams(prevState => {
            prevState.set(PARAM_KEY_MODAL, PARAM_VALUE_MODAL_BORROWING);
            prevState.set(PARAM_KEY_ID, String(id));
            return prevState;
        });
    }, [ setSearchParams ]);

    const attemptDelete = useCallback((id: number) => {
        deleteBorrowing(id)
            .then(() => window.location.reload())
            .catch(displayErrorNotification);
    }, []);

    return (
        <DataTable dataList={ borrowings } excludedProperties={ [ "id" ] }>
            <DataTableDataColumn list={ borrowings } forKey="reader"
                                 header="Olvasó">
                { value => (
                    <Link to={ `/members/${ value.id }` }>
                        <Typography variant="small" className="font-bold hover:underline">
                            { value.name }
                        </Typography>
                    </Link>
                ) }
            </DataTableDataColumn>
            <DataTableDataColumn list={ borrowings } forKey="borrowDate"
                                 header="Kölcsönzés dátuma">
                { value => (
                    <Typography variant="small">
                        { value.toLocaleDateString() }
                    </Typography>
                ) }
            </DataTableDataColumn>
            <DataTableDataColumn list={ borrowings } forKey="book"
                                 header="Könyv">
                { value => (
                    <Link to={ `/books/${ value.id }` }>
                        <Typography variant="small" className="hover:underline">
                            { value.title }
                        </Typography>
                    </Link>
                ) }
            </DataTableDataColumn>
            <DataTableActionColumn list={ borrowings }>
                { ({ id }) => (
                    <div className="flex flex-row gap-2">
                        <IconButton variant="text" onClick={ () => openModal(id) }>
                            <MaterialSymbol name="edit" />
                        </IconButton>
                    </div>
                ) }
            </DataTableActionColumn>
        </DataTable>
    );
}

function BorrowingModal() {
    const [ searchParams, setSearchParams ] = useSearchParams();
    const [ borrowing, loadingBorrowing ] = useBorrowingDetails(
        searchParams.has(PARAM_KEY_ID) ? parseInt(searchParams.get(PARAM_KEY_ID)!) : -1
    );

    const [ borrowingEditData, setBorrowingEditData ] = useState<BorrowingEditData>(
        defaultBorrowEditData
    );
    const [ loading, setLoading ] = useState(false);

    const open = useMemo(() => {
        return searchParams.get(PARAM_KEY_MODAL) === PARAM_VALUE_MODAL_BORROWING;
    }, [ searchParams ]);
    const setOpen = useCallback((isOpen: boolean) => {
        setSearchParams(prevState => {
            if (isOpen) {
                prevState.set(PARAM_KEY_MODAL, PARAM_VALUE_MODAL_BORROWING);
            } else {
                prevState.delete(PARAM_KEY_MODAL);
                prevState.delete(PARAM_KEY_ID);
            }

            return prevState;
        });

        setBorrowingEditData(defaultBorrowEditData);
    }, [ setSearchParams ]);

    const canCreate = useMemo(() => {
        return [ borrowingEditData.borrowDate, borrowingEditData.readerNumber,
            borrowingEditData.inventoryNumber, borrowingEditData.returnDate ]
            .every(value => !!value);
    }, [ borrowingEditData.borrowDate, borrowingEditData.inventoryNumber,
        borrowingEditData.readerNumber, borrowingEditData.returnDate ]);

    const commit = useCallback(() => {
        if (!canCreate) return;

        const promise = !borrowing ? createBorrowing(borrowingEditData) :
            editBorrowing(borrowing.id, borrowingEditData);

        setLoading(true);
        promise.then(() => {
            setOpen(false);
            window.location.reload();
        }).catch(displayErrorNotification).finally(() => setLoading(false));
    }, [ borrowing, borrowingEditData, canCreate, setOpen ]);

    useEffect(() => {
        setBorrowingEditData(borrowing ?? defaultBorrowEditData());
    }, [ borrowing ]);

    return (
        <Dialog open={ open } handler={ setOpen }>
            <DialogHeader>
                <Typography variant="lead">
                    { !borrowing ? "Beszerzés rögzítése" : "Beszerzés szerkesztése" }
                </Typography>
            </DialogHeader>
            <hr />
            <DialogBody>
                { loadingBorrowing ? <Spinner /> : (
                    <BorrowingEditLayout data={ borrowingEditData }
                                         onData={ setBorrowingEditData } />
                ) }
            </DialogBody>
            <hr />
            <DialogFooter className="flex flex-row items-center justify-end gap-2">
                <Button variant="text" onClick={ () => setOpen(false) }>
                    Mégsem
                </Button>
                <Button variant="filled" disabled={ loading || loadingBorrowing || !canCreate }
                        onClick={ commit }>
                    { !borrowing ? "Rögzítés" : "Változtatások mentése" }
                </Button>
            </DialogFooter>
        </Dialog>
    );
}

function defaultBorrowEditData(): BorrowingEditData {
    return {
        borrowDate: new Date(),
        inventoryNumber: undefined,
        lateFee: 0,
        readerNumber: undefined,
        returnDate: new Date(Date.now() + 1209600000)
    };
}
