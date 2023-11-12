import { SelectComponentProps } from "@/utils/types";
import { useLibraryFromContext } from "@/library/hooks";
import { useMemo } from "react";
import { GenericSelect } from "@/utils/components/selects";

export default function AuthorSelect(props: SelectComponentProps<number | undefined>) {
    const { authors } = useLibraryFromContext();

    const options = useMemo<{ [id: number]: string }>(() => {
        const out: { [id: number]: string } = {};

        authors.forEach(value => {
            out[value.id] = value.name;
        });

        return out;
    }, [ authors ]);

    return (
        <GenericSelect options={ options }
                       label="Író"
                       selected={ String(props.selected) }
                       onSelect={ value => props.onSelect(parseInt(value)) } />
    );
}
