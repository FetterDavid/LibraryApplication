import { Link, Navigate, useParams } from "react-router-dom";
import { useMemberDetails } from "@/members/hooks";
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
import { Member, MemberEditData } from "@/members/types";
import { Fragment, useCallback, useMemo, useState } from "react";
import { createMember, editMember } from "@/members/api";
import { displayErrorNotification } from "@/notifications";
import { MemberEditLayout } from "@/members/components";
import { useLibraryFromContext } from "@/library/hooks";
import {
    DataTable,
    DataTableActionColumn,
    DataTableDataColumn
} from "@/utils/components/data-table";
import { MaterialSymbol } from "@/utils/components";

export default function MemberProfilePage() {
    const { id: memberId } = useParams();
    const [ member, loadingMember ] = useMemberDetails(memberId ? parseInt(memberId) : -1);

    return (
        <LoadingView condition={ loadingMember }>
            <LoadingViewError condition={ !member }>
                <Navigate to=".." relative="path" />
            </LoadingViewError>
            <LoadingViewContent>
                <div className="flex flex-col items-stretch gap-4">
                    <Card>
                        <CardHeader floated={ false } shadow={ false } className="m-6">
                            { !!member && (
                                <Typography className="text-center select-none" variant="lead">
                                    { member.name }
                                </Typography>
                            ) }
                        </CardHeader>
                        <MemberDetailsEditor { ...member! } />
                    </Card>
                    <BorrowHistory { ...member! } />
                </div>
            </LoadingViewContent>
        </LoadingView>
    );
}

function MemberDetailsEditor(props: Member) {
    const [ memberEditData, setMemberEditData ] = useState<MemberEditData>(props);
    const [ loading, setLoading ] = useState(false);

    const canCreate = useMemo(() => {
        return [ memberEditData.membershipType, memberEditData.name, memberEditData.email ]
            .every(value => !!value);
    }, [ memberEditData.email, memberEditData.membershipType, memberEditData.name ]);

    const commit = useCallback(() => {
        if (!canCreate) return;

        const promise = !props ? createMember(memberEditData) :
            editMember(props.id, memberEditData);

        setLoading(true);
        promise.then(() => {
            window.location.reload();
        }).catch(displayErrorNotification).finally(() => setLoading(false));
    }, [ props, memberEditData, canCreate ]);

    return (
        <Fragment>
            <hr />
            <CardBody>
                <MemberEditLayout data={ memberEditData } onData={ setMemberEditData } />
            </CardBody>
            <hr />
            <CardFooter className="flex flex-row items-center justify-end gap-2">
                <Button variant="filled" disabled={ loading }
                        onClick={ commit }>
                    Változtatások mentése
                </Button>
            </CardFooter>
        </Fragment>
    );
}

function BorrowHistory(props: Member) {
    const { borrowings } = useLibraryFromContext();
    const memberBorrowings = useMemo(() => {
        return borrowings.filter(value => value.readerNumber === props.id);
    }, [ borrowings, props.id ]);

    return (
        <Card>
            <CardHeader floated={ false } shadow={ false } className="m-6">
                <Typography className="text-center select-none" variant="h6">
                    Kölcsönzések
                </Typography>
            </CardHeader>
            <CardBody>
                <DataTable dataList={ memberBorrowings } excludedProperties={ [ "id" ] }>
                    <DataTableDataColumn list={ memberBorrowings } forKey="book"
                                         header="Könyv">
                        { value => (
                            <Link to={ `/books/${ value.id }` }>
                                <Typography variant="small" className="hover:underline">
                                    <span>{ value.author.name }</span>: <b>{ value.title }</b>
                                </Typography>
                            </Link>
                        ) }
                    </DataTableDataColumn>
                    <DataTableDataColumn list={ memberBorrowings } forKey="borrowDate"
                                         header="Kölcsönzés dátuma">
                        { value => (
                            <Typography variant="small">
                                { value.toLocaleDateString() }
                            </Typography>
                        ) }
                    </DataTableDataColumn>
                    <DataTableActionColumn list={ memberBorrowings }>
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
