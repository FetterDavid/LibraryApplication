import { useId, useMemo } from "react";
import { Option, Select } from "@material-tailwind/react";

import { SelectComponentProps } from "@/utils/types";

interface GenericSelectProps<T extends string> extends SelectComponentProps<T> {
    options: T[] | readonly T[] | { [key in T]: string };
    label: string;
}

export default function GenericSelect<T extends string>(props: GenericSelectProps<T>) {
    const id = useId();

    const resolvedOptions = useMemo<[ string, string ][]>(() => {
        if (props.options instanceof Array) {
            return (props.options as string[]).map(value => [ value, value ]);
        } else {
            return Object.keys(props.options).map(key => {
                return [ key, (props.options as { [key: string]: string })[key] ];
            });
        }
    }, [ props.options ]);

    return (
        <Select id={ id } value={ props.selected } label={ props.label }
                onChange={ value => props.onSelect(value as T) }
                disabled={ props.disabled } error={ props.error }>
            { resolvedOptions.map(([ value, displayName ], index) => (
                <Option key={ index } value={ value }>{ displayName }</Option>
            )) }
        </Select>
    );
}
