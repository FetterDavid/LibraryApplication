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
import { useSearchParams } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import { displayErrorNotification } from "@/notifications";
import {
    DataTable,
    DataTableActionColumn,
    DataTableDataColumn
} from "@/utils/components/data-table";
import { MaterialSymbol } from "@/utils/components";
import { DestructiveIconButton } from "@/utils/components/inputs";
import { AcquisitionEditData } from "@/acquisitions/types";
import { useAcquisitionDetails } from "@/acquisitions/hooks";
import { createAcquisition, deleteAcquisition, editAcquisition } from "@/acquisitions/api";
import { AcquisitionEditLayout } from "@/acquisitions/components";

const PARAM_KEY_MODAL = "modal";
const PARAM_VALUE_MODAL_ACQUISITION = "acquisition";
const PARAM_KEY_ID = "id";

export default function AcquisitionsPage() {
    const [ , setSearchParams ] = useSearchParams();

    const openModal = useCallback(() => {
        setSearchParams(prevState => {
            prevState.set(PARAM_KEY_MODAL, PARAM_VALUE_MODAL_ACQUISITION);
            return prevState;
        });
    }, [ setSearchParams ]);

    return (
        <Card>
            <CardHeader floated={ false } shadow={ false } className="m-6">
                <Typography className="text-center select-none" variant="lead">
                    Beszerzések
                </Typography>
            </CardHeader>
            <hr />
            <CardBody>
                <AcquisitionsDataTable />
            </CardBody>
            <hr />
            <CardFooter>
                <Button variant="filled" onClick={ openModal }>
                    Új beszerzés rögzítése
                </Button>
            </CardFooter>
            <AcquisitionModal />
        </Card>
    );
}

function AcquisitionsDataTable() {
    const { acquisitions } = useLibraryFromContext();
    const [ , setSearchParams ] = useSearchParams();

    const openModal = useCallback((id: number) => {
        setSearchParams(prevState => {
            prevState.set(PARAM_KEY_MODAL, PARAM_VALUE_MODAL_ACQUISITION);
            prevState.set(PARAM_KEY_ID, String(id));
            return prevState;
        });
    }, [ setSearchParams ]);

    const attemptDelete = useCallback((id: number) => {
        deleteAcquisition(id)
            .then(() => window.location.reload())
            .catch(displayErrorNotification);
    }, []);

    return (
        <DataTable dataList={ acquisitions } excludedProperties={ [ "id" ] }>
            <DataTableDataColumn list={ acquisitions } forKey="acquisitionSource"
                                 header="Forrás">
                { value => (
                    <Typography variant="small" className="font-bold">
                        { value }
                    </Typography>
                ) }
            </DataTableDataColumn>
            <DataTableDataColumn list={ acquisitions } forKey="price"
                                 header="Ár">
                { value => (
                    <Typography variant="small">
                        { value }
                    </Typography>
                ) }
            </DataTableDataColumn>
            <DataTableDataColumn list={ acquisitions } forKey="acquisitionDate"
                                 header="Dátum">
                { value => (
                    <Typography variant="small">
                        { value.toLocaleDateString() }
                    </Typography>
                ) }
            </DataTableDataColumn>
            <DataTableActionColumn list={ acquisitions }>
                { ({ id }) => (
                    <div className="flex flex-row gap-2">
                        <IconButton variant="text" onClick={ () => openModal(id) }>
                            <MaterialSymbol name="edit" />
                        </IconButton>
                        <DestructiveIconButton onClick={ () => attemptDelete(id) }>
                            <MaterialSymbol name="delete" />
                        </DestructiveIconButton>
                    </div>
                ) }
            </DataTableActionColumn>
        </DataTable>
    );
}

function AcquisitionModal() {
    const [ searchParams, setSearchParams ] = useSearchParams();
    const [ acquisition, loadingAcquisition ] = useAcquisitionDetails(
        searchParams.has(PARAM_KEY_ID) ? parseInt(searchParams.get(PARAM_KEY_ID)!) : -1
    );

    const [ acquisitionEditData, setAcquisitionEditData ] = useState<AcquisitionEditData>(
        defaultAcquisitionEditData
    );
    const [ loading, setLoading ] = useState(false);

    const open = useMemo(() => {
        return searchParams.get(PARAM_KEY_MODAL) === PARAM_VALUE_MODAL_ACQUISITION;
    }, [ searchParams ]);
    const setOpen = useCallback((isOpen: boolean) => {
        setSearchParams(prevState => {
            if (isOpen) {
                prevState.set(PARAM_KEY_MODAL, PARAM_VALUE_MODAL_ACQUISITION);
            } else {
                prevState.delete(PARAM_KEY_MODAL);
                prevState.delete(PARAM_KEY_ID);
            }

            return prevState;
        });

        setAcquisitionEditData(defaultAcquisitionEditData);
    }, [ setSearchParams ]);

    const canCreate = useMemo(() => {
        return [ acquisitionEditData.acquisitionDate, acquisitionEditData.acquisitionSource,
            acquisitionEditData.bookId, acquisitionEditData.price ]
            .every(value => !!value);
    }, [ acquisitionEditData.acquisitionDate, acquisitionEditData.acquisitionSource,
        acquisitionEditData.bookId, acquisitionEditData.price ]);

    const commit = useCallback(() => {
        if (!canCreate) return;

        const promise = !acquisition ? createAcquisition(acquisitionEditData) :
            editAcquisition(acquisition.id, acquisitionEditData);

        setLoading(true);
        promise.then(() => {
            setOpen(false);
            window.location.reload();
        }).catch(displayErrorNotification).finally(() => setLoading(false));
    }, [ acquisition, acquisitionEditData, canCreate, setOpen ]);

    useEffect(() => {
        setAcquisitionEditData(acquisition ?? defaultAcquisitionEditData());
    }, [ acquisition ]);

    return (
        <Dialog open={ open } handler={ setOpen }>
            <DialogHeader>
                <Typography variant="lead">
                    { !acquisition ? "Beszerzés rögzítése" : "Beszerzés szerkesztése" }
                </Typography>
            </DialogHeader>
            <hr />
            <DialogBody>
                { loadingAcquisition ? <Spinner /> : (
                    <AcquisitionEditLayout data={ acquisitionEditData }
                                           onData={ setAcquisitionEditData } />
                ) }
            </DialogBody>
            <hr />
            <DialogFooter className="flex flex-row items-center justify-end gap-2">
                <Button variant="text" onClick={ () => setOpen(false) }>
                    Mégsem
                </Button>
                <Button variant="filled" disabled={ loading || loadingAcquisition || !canCreate }
                        onClick={ commit }>
                    { !acquisition ? "Rögzítés" : "Változtatások mentése" }
                </Button>
            </DialogFooter>
        </Dialog>
    );
}

function defaultAcquisitionEditData(): AcquisitionEditData {
    return {
        acquisitionDate: new Date(),
        acquisitionSource: "",
        bookId: undefined,
        price: 0
    };
}

