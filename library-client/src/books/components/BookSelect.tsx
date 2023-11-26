import { SelectComponentProps } from "@/utils/types";
import { useLibraryFromContext } from "@/library/hooks";
import { useMemo } from "react";
import { GenericSelect } from "@/utils/components/selects";

export default function BookSelect(props: SelectComponentProps<number | undefined>) {
    const { books } = useLibraryFromContext();

    const options = useMemo<{ [id: number]: string }>(() => {
        const out: { [id: number]: string } = {};

        books.sort((a, b) => {
            if (a.title !== b.title) return a.title.localeCompare(b.title);
            if (a.author.name !== b.author.name) return a.author.name.localeCompare(b.author.name);
            return a.publicationYear - b.publicationYear;
        }).forEach(value => {
            out[value.id] =
                `${ value.title } - ${ value.author.name } (${ value.publicationYear })`;
        });

        return out;
    }, [ books ]);

    return (
        <GenericSelect options={ options }
                       label="Könyv"
                       selected={ String(props.selected) }
                       onSelect={ value => props.onSelect(parseInt(value)) } />
    );
}
