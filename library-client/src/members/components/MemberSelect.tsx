import { useLibraryFromContext } from "@/library/hooks";
import { useMemo } from "react";
import { GenericSelect } from "@/utils/components/selects";
import { SelectComponentProps } from "@/utils/types";

export default function MemberSelect(props: SelectComponentProps<number | undefined>) {
    const { members } = useLibraryFromContext();

    const options = useMemo<{ [id: number]: string }>(() => {
        const out: { [id: number]: string } = {};

        members.sort((a, b) => a.name.localeCompare(b.name)).forEach(value => {
            out[value.id] = value.name;
        });

        return out;
    }, [ members ]);

    return (
        <GenericSelect options={ options }
                       label="Olvasó"
                       disabled={ props.disabled }
                       selected={ String(props.selected) }
                       onSelect={ value => props.onSelect(parseInt(value)) } />
    );
}
