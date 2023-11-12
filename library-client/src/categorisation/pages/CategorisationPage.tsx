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
import {
    createCategorizationObject,
    deleteCategorisationObject,
    editCategorisationObject
} from "@/categorisation/api";
import { displayErrorNotification, displayInfoNotification } from "@/notifications";
import { MaterialSymbol } from "@/utils/components";
import { useCategorisationObjectDetails } from "@/categorisation/hooks";
import { categorisationTypeName } from "@/categorisation";
import { DestructiveIconButton } from "@/utils/components/inputs";

const PARAM_KEY_TAB = "tab";
const PARAM_VALUE_TAB_CATEGORIES = "categories";
const PARAM_VALUE_TAB_AUTHORS = "authors";
const PARAM_VALUE_TAB_PUBLISHERS = "publishers";
const PARAM_KEY_MODAL = "modal";
const PARAM_VALUE_MODAL_NEW = "new";
const PARAM_KEY_TYPE = "type";
const PARAM_KEY_ID = "id";

const tabs: {
    label: string
    value: string
    type: CategorisationType
}[] = [ {
    label: "Kategóriák",
    value: PARAM_VALUE_TAB_CATEGORIES,
    type: "categories"
}, {
    label: "Írók",
    value: PARAM_VALUE_TAB_AUTHORS,
    type: "authors"
}, {
    label: "Kiadók",
    value: PARAM_VALUE_TAB_PUBLISHERS,
    type: "publishers"
} ];

export default function CategorisationPage() {
    const library = useLibraryFromContext();
    const [ searchParams, setSearchParams ] = useSearchParams();

    const defaultTab = useMemo(() => {
        if (!searchParams.has(PARAM_KEY_TAB)) {
            return PARAM_VALUE_TAB_CATEGORIES;
        }

        const paramTab = searchParams.get(PARAM_KEY_TAB)!;
        if (![ PARAM_VALUE_TAB_CATEGORIES, PARAM_VALUE_TAB_AUTHORS, PARAM_VALUE_TAB_PUBLISHERS ]
            .includes(paramTab)) {
            return PARAM_VALUE_TAB_CATEGORIES;
        }

        return paramTab;
    }, [ searchParams ]);

    return (
        <Card>
            <Tabs value={ defaultTab }>
                <CardHeader floated={ false } shadow={ false } className="rounded-none m-6">
                    <TabsHeader>
                        { tabs.map(({ value, label }, index) => (
                            <Tab value={ value } key={ index } onClick={ () => {
                                setSearchParams(prevState => {
                                    prevState.set(PARAM_KEY_TAB, value);
                                    return prevState;
                                });
                            } }>
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
            prevState.set(PARAM_KEY_TYPE, props.type);

            if (!!id) {
                prevState.set(PARAM_KEY_ID, String(id));
            }

            return prevState;
        });
    }, [ props.type, setSearchParams ]);

    const attemptDelete = useCallback((id: number) => {
        deleteCategorisationObject(props.type, id)
            .then(() => window.location.reload())
            .catch(displayErrorNotification);
    }, [ props.type ]);

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
                    <DataTableActionColumn list={ props.list } element={ ({ id }) => (
                        <div className="flex flex-row gap-2">
                            <IconButton variant="text" onClick={ () => openModal(id) }>
                                <MaterialSymbol name="edit" />
                            </IconButton>
                            <DestructiveIconButton onClick={ () => attemptDelete(id) }>
                                <MaterialSymbol name="delete" />
                            </DestructiveIconButton>
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
            searchParams.get(PARAM_KEY_TYPE) === props.type;
    }, [ props.type, searchParams ]);

    const setOpen = useCallback((isOpen: boolean) => {
        setSearchParams(prevState => {
            if (isOpen) {
                prevState.set(PARAM_KEY_MODAL, PARAM_VALUE_MODAL_NEW);
                prevState.set(PARAM_KEY_TYPE, props.type);
            } else {
                prevState.delete(PARAM_KEY_MODAL);
                prevState.delete(PARAM_KEY_TYPE);
                prevState.delete(PARAM_KEY_ID);
            }

            return prevState;
        });

        setName("");
    }, [ props.type, setSearchParams ]);

    const [ catObj, loadingCatObj ] = useCategorisationObjectDetails(props.type,
        searchParams.has(PARAM_KEY_ID) && open ?
            parseInt(searchParams.get(PARAM_KEY_ID)!) : -1
    );

    const [ name, setName ] = useState("");
    const [ loading, setLoading ] = useState(false);

    const create = useCallback(() => {
        if (!name) return;

        setLoading(true);
        const id = searchParams.has(PARAM_KEY_ID) ?
            parseInt(searchParams.get(PARAM_KEY_ID)!) :
            undefined;
        const promise = !id ? createCategorizationObject(props.type, name) :
            editCategorisationObject(props.type, id, name);

        promise.then(() => {
            const action = searchParams.has(PARAM_KEY_ID) ? "módosítva" : "létrehozva";
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
                            { searchParams.has(PARAM_KEY_ID) ? "módosítása" : "létrhozása" }
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
                            { searchParams.has(PARAM_KEY_ID) ? "Módosítás" : "Létrehozás" }
                        </Button>
                    </DialogFooter>
                </Fragment>
            ) }
        </Dialog>
    );
}
