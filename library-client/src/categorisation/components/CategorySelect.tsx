import { SelectComponentProps } from "@/utils/types";
import { useLibraryFromContext } from "@/library/hooks";
import { useMemo } from "react";
import { GenericSelect } from "@/utils/components/selects";

export default function CategorySelect(props: SelectComponentProps<number | undefined>) {
    const { categories } = useLibraryFromContext();

    const options = useMemo<{ [id: number]: string }>(() => {
        const out: { [id: number]: string } = {};

        categories.forEach(value => {
            out[value.id] = value.name;
        });

        return out;
    }, [ categories ]);

    return (
        <GenericSelect options={ options }
                       label="Kategória"
                       selected={ String(props.selected) }
                       onSelect={ value => props.onSelect(parseInt(value)) } />
    );
}
