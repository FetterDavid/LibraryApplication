import { SelectComponentProps } from "@/utils/types";
import { useLibraryFromContext } from "@/library/hooks";
import { useMemo } from "react";
import { GenericSelect } from "@/utils/components/selects";

export default function PublisherSelect(props: SelectComponentProps<number | undefined>) {
    const { publishers } = useLibraryFromContext();

    const options = useMemo<{ [id: number]: string }>(() => {
        const out: { [id: number]: string } = {};

        publishers.forEach(value => {
            out[value.id] = value.name;
        });

        return out;
    }, [ publishers ]);

    return (
        <GenericSelect options={ options }
                       label="Kiadó"
                       selected={ String(props.selected) }
                       onSelect={ value => props.onSelect(parseInt(value)) } />
    );
}
