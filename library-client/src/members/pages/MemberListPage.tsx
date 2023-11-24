import { useSearchParams } from "react-router-dom";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
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
import { useLibraryFromContext } from "@/library/hooks";
import {
    DataTable,
    DataTableActionColumn,
    DataTableDataColumn
} from "@/utils/components/data-table";
import { MaterialSymbol } from "@/utils/components";
import { displayErrorNotification } from "@/notifications";
import { MemberEditData } from "@/members/types";
import { MemberEditLayout } from "@/members/components/MemberEditLayout";
import { createMember, deleteMember, editMember } from "@/members/api";
import { useMemberDetails } from "@/members/hooks";
import { DestructiveIconButton } from "@/utils/components/inputs";

const PARAM_KEY_MODAL = "modal";
const PARAM_VALUE_MODAL_MEMBER = "member";
const PARAM_KEY_ID = "id";

export default function MemberListPage() {
    const [ , setSearchParams ] = useSearchParams();

    const openModal = useCallback(() => {
        setSearchParams(prevState => {
            prevState.set(PARAM_KEY_MODAL, PARAM_VALUE_MODAL_MEMBER);
            return prevState;
        });
    }, [ setSearchParams ]);

    return (
        <Fragment>
            <Card>
                <CardHeader floated={ false } shadow={ false } className="m-6">
                    <Typography className="text-center select-none" variant="lead">
                        Tagok
                    </Typography>
                </CardHeader>
                <hr />
                <CardBody>
                    <MembersDataTable />
                </CardBody>
                <hr />
                <CardFooter>
                    <Button variant="filled" onClick={ openModal }>
                        Új tag felvétele
                    </Button>
                </CardFooter>
            </Card>
            <MemberModal />
        </Fragment>
    );
}

function MembersDataTable() {
    const { members } = useLibraryFromContext();
    const [ , setSearchParams ] = useSearchParams();

    const openModal = useCallback((id: number) => {
        setSearchParams(prevState => {
            prevState.set(PARAM_KEY_MODAL, PARAM_VALUE_MODAL_MEMBER);
            prevState.set(PARAM_KEY_ID, String(id));
            return prevState;
        });
    }, [ setSearchParams ]);

    const attemptDelete = useCallback((id: number) => {
        deleteMember(id)
            .then(() => window.location.reload())
            .catch(displayErrorNotification);
    }, []);

    return (
        <DataTable dataList={ members } excludedProperties={ [ "id" ] }>
            <DataTableDataColumn list={ members } forKey="name"
                                 header="Név">
                { value => (
                    <Typography variant="small" className="font-bold">
                        { value }
                    </Typography>
                ) }
            </DataTableDataColumn>
            <DataTableDataColumn list={ members } forKey="email"
                                 header="E-mail">
                { value => (
                    <Typography variant="small">
                        { value }
                    </Typography>
                ) }
            </DataTableDataColumn>
            <DataTableDataColumn list={ members } forKey="membershipType"
                                 header="Tagság típusa">
                { value => (
                    <Chip value={ value } variant="ghost"
                          className="w-min" color="deep-purple" />
                ) }
            </DataTableDataColumn>
            <DataTableActionColumn list={ members }>
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

function MemberModal() {
    const [ searchParams, setSearchParams ] = useSearchParams();
    const [ member, loadingMember ] = useMemberDetails(
        searchParams.has(PARAM_KEY_ID) ? parseInt(searchParams.get(PARAM_KEY_ID)!) : -1
    );

    const [ memberEditData, setMemberEditData ] = useState<MemberEditData>(defaultMemberEditData);
    const [ loading, setLoading ] = useState(false);

    const open = useMemo(() => {
        return searchParams.get(PARAM_KEY_MODAL) === PARAM_VALUE_MODAL_MEMBER;
    }, [ searchParams ]);
    const setOpen = useCallback((isOpen: boolean) => {
        setSearchParams(prevState => {
            if (isOpen) {
                prevState.set(PARAM_KEY_MODAL, PARAM_VALUE_MODAL_MEMBER);
            } else {
                prevState.delete(PARAM_KEY_MODAL);
                prevState.delete(PARAM_KEY_ID);
            }

            return prevState;
        });

        setMemberEditData(defaultMemberEditData);
    }, [ setSearchParams ]);

    const canCreate = useMemo(() => {
        return [ memberEditData.membershipType, memberEditData.name, memberEditData.email ]
            .every(value => !!value);
    }, [ memberEditData.email, memberEditData.membershipType, memberEditData.name ]);

    const commit = useCallback(() => {
        if (!canCreate) return;

        const promise = !member ? createMember(memberEditData) :
            editMember(member.id, memberEditData);

        setLoading(true);
        promise.then(() => {
            setOpen(false);
            window.location.reload();
        }).catch(displayErrorNotification).finally(() => setLoading(false));
    }, [ member, memberEditData, canCreate, setOpen ]);

    useEffect(() => {
        setMemberEditData(member ?? defaultMemberEditData());
    }, [ member ]);

    return (
        <Dialog open={ open } handler={ setOpen }>
            <DialogHeader>
                <Typography variant="lead">
                    { !member ? "Tag hozzáadása" : "Tag adatainak szerkesztése" }
                </Typography>
            </DialogHeader>
            <hr />
            <DialogBody>
                { loadingMember ? <Spinner /> : (
                    <MemberEditLayout data={ memberEditData } onData={ setMemberEditData } />
                ) }
            </DialogBody>
            <hr />
            <DialogFooter className="flex flex-row items-center justify-end gap-2">
                <Button variant="text" onClick={ () => setOpen(false) }>
                    Mégsem
                </Button>
                <Button variant="filled" disabled={ loading || loadingMember }
                        onClick={ commit }>
                    { !member ? "Hozzáadás" : "Változtatások mentése" }
                </Button>
            </DialogFooter>
        </Dialog>
    );
}

function defaultMemberEditData(): MemberEditData {
    return {
        email: "",
        membershipType: "",
        name: ""
    };
}
