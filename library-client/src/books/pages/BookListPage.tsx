import { useLibraryFromContext } from "@/library/hooks";
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Dialog,
    Typography
} from "@material-tailwind/react";
import { DataTable, DataTableDataColumn } from "@/utils/components/data-table";
import { Fragment, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

const PARAM_KEY_MODAL = "modal";
const PARAM_VALUE_MODAL_NEW_BOOK = "new-book";

export default function BookListPage() {
    const [ , setSearchParams ] = useSearchParams();
    const library = useLibraryFromContext();

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
                    <DataTable dataList={ library.books }>
                        <DataTableDataColumn list={ library.books } forKey="inventoryNumber"
                                             element={ value => (
                                                 <Typography>{ value }</Typography>
                                             ) } />
                    </DataTable>
                </CardBody>
                <hr />
                <CardFooter>
                    <Button variant="filled" onClick={ () => {
                        setSearchParams(prevState => {
                            prevState.set(PARAM_KEY_MODAL, PARAM_VALUE_MODAL_NEW_BOOK);
                            return prevState;
                        });
                    } }>
                        Új könyv felvétele
                    </Button>
                </CardFooter>
            </Card>
            <NewBookModal />
        </Fragment>
    );
}

function NewBookModal() {
    const [ searchParams, setSearchParams ] = useSearchParams();

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
    }, [ setSearchParams ]);

    return (
        <Dialog open={ open } handler={ setOpen }>
            <Card>
                <CardBody>
                    TODO
                </CardBody>
            </Card>
        </Dialog>
    );
}
