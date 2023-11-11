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
    Input,
    Spinner,
    Tab,
    TabPanel,
    Tabs,
    TabsBody,
    TabsHeader,
    Typography
} from "@material-tailwind/react";
import { useLibraryFromContext } from "@/library/hooks";
import { Identifiable } from "@/utils/types";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import {
    DataTable,
    DataTableActionColumn,
    DataTableDataColumn
} from "@/utils/components/data-table";
import { useSearchParams } from "react-router-dom";
import { CategorisationType } from "@/categorisation/types";
import { createCategorizationObject, editCategorisationObject } from "@/categorisation/api";
import { displayErrorNotification, displayInfoNotification } from "@/notifications";
import { MaterialSymbol } from "@/utils/components";
import { useCategorisationObjectDetails } from "@/categorisation/hooks";
import { categorisationTypeName } from "@/categorisation";

const tabs: {
    label: string
    value: string
    type: CategorisationType
}[] = [ {
    label: "Kategóriák",
    value: "categories",
    type: "categories"
}, {
    label: "Írók",
    value: "authors",
    type: "authors"
}, {
    label: "Kiadók",
    value: "publishers",
    type: "publishers"
} ];

const PARAM_KEY_MODAL = "modal";
const PARAM_VALUE_MODAL_NEW = "new";
const PARAMS_KEY_TYPE = "type";
const PARAMS_KEY_ID = "id";

export default function CategorisationPage() {
    const library = useLibraryFromContext();

    return (
        <Card>
            <Tabs value="categories">
                <CardHeader floated={ false } shadow={ false } className="rounded-none m-6">
                    <TabsHeader>
                        { tabs.map(({ value, label }, index) => (
                            <Tab value={ value } key={ index }>
                                { label }
                            </Tab>
                        )) }
                    </TabsHeader>
                </CardHeader>
                <hr />
                <TabsBody>
                    { tabs.map(({ value, type }, index) => (
                        <TabPanel value={ value } key={ index } className="p-0">
                            <Content list={ library[type].sort((a, b) => {
                                return a.name.localeCompare(b.name);
                            }) } type={ type } />
                        </TabPanel>
                    )) }
                </TabsBody>
            </Tabs>
        </Card>
    );
}

function Content<T extends Identifiable & { name: string }>(props: {
    type: CategorisationType
    list: T[]
}) {
    const [ , setSearchParams ] = useSearchParams();

    const openModal = useCallback((id?: number) => {
        setSearchParams(prevState => {
            prevState.set(PARAM_KEY_MODAL, PARAM_VALUE_MODAL_NEW);
            prevState.set(PARAMS_KEY_TYPE, props.type);

            if (!!id) {
                prevState.set(PARAMS_KEY_ID, String(id));
            }

            return prevState;
        });
    }, [ props.type, setSearchParams ]);

    return (
        <Fragment>
            <CardBody>
                <DataTable dataList={ props.list } excludedProperties={ [ "id" ] }>
                    <DataTableDataColumn list={ props.list } forKey="name"
                                         header="név"
                                         element={ value => (
                                             <Typography>
                                                 { value }
                                             </Typography>
                                         ) } />
                    <DataTableActionColumn list={ props.list } element={ entry => (
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
            </CardBody>
            <hr />
            <CardFooter>
                <Button variant="filled" onClick={ () => openModal() }>
                    Létrehozás
                </Button>
            </CardFooter>
            <Modal type={ props.type } />
        </Fragment>
    );
}

function Modal(props: { type: CategorisationType }) {
    const [ searchParams, setSearchParams ] = useSearchParams();

    const open = useMemo(() => {
        return searchParams.get(PARAM_KEY_MODAL) === PARAM_VALUE_MODAL_NEW &&
            searchParams.get(PARAMS_KEY_TYPE) === props.type;
    }, [ props.type, searchParams ]);

    const setOpen = useCallback((isOpen: boolean) => {
        setSearchParams(prevState => {
            if (isOpen) {
                prevState.set(PARAM_KEY_MODAL, PARAM_VALUE_MODAL_NEW);
                prevState.set(PARAMS_KEY_TYPE, props.type);
            } else {
                prevState.delete(PARAM_KEY_MODAL);
                prevState.delete(PARAMS_KEY_TYPE);
                prevState.delete(PARAMS_KEY_ID);
            }

            return prevState;
        });

        setName("");
    }, [ props.type, setSearchParams ]);

    const [ catObj, loadingCatObj ] = useCategorisationObjectDetails(props.type,
        searchParams.has(PARAMS_KEY_ID) && open ?
            parseInt(searchParams.get(PARAMS_KEY_ID)!) : -1
    );

    const [ name, setName ] = useState("");
    const [ loading, setLoading ] = useState(false);

    const create = useCallback(() => {
        if (!name) return;

        setLoading(true);
        const id = searchParams.has(PARAMS_KEY_ID) ?
            parseInt(searchParams.get(PARAMS_KEY_ID)!) :
            undefined;
        const promise = !id ? createCategorizationObject(props.type, name) :
            editCategorisationObject(props.type, id, name);

        promise.then(() => {
            const action = searchParams.has(PARAMS_KEY_ID) ? "módosítva" : "létrehozva";
            displayInfoNotification(`${ categorisationTypeName(props.type) } ${ action }`);
        }).catch(displayErrorNotification).finally(() => {
            setOpen(false);
            window.location.reload();
        });
    }, [ name, props.type, searchParams, setOpen ]);

    useEffect(() => {
        if (!!catObj) setName(catObj.name);
    }, [ catObj ]);

    return (
        <Dialog open={ open } handler={ setOpen }>
            { loadingCatObj ? <Spinner /> : (
                <Fragment>
                    <DialogHeader>
                        <Typography variant="lead">
                            { categorisationTypeName(props.type) }&nbsp;
                            { searchParams.has(PARAMS_KEY_ID) ? "módosítása" : "létrhozása" }
                        </Typography>
                    </DialogHeader>
                    <hr />
                    <DialogBody>
                        <Input crossOrigin="" value={ name } onChange={ event => {
                            setName(event.target.value);
                        } } label="Név" />
                    </DialogBody>
                    <hr />
                    <DialogFooter className="flex flex-row items-center justify-end gap-2">
                        <Button variant="text" onClick={ () => setOpen(false) }>
                            Mégsem
                        </Button>
                        <Button variant="filled" onClick={ create } disabled={ !name || loading }>
                            { searchParams.has(PARAMS_KEY_ID) ? "Módosítás" : "Létrehozás" }
                        </Button>
                    </DialogFooter>
                </Fragment>
            ) }
        </Dialog>
    );
}
