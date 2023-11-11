import { ReactNode, useContext, useEffect } from "react";
import { DataTableContextType } from "@/utils/components/data-table/DataTableContext";
import { DataTableContext } from "@/utils/components/data-table/index";
import { Identifiable } from "@/utils/types";

export interface DataTableActionColumnProps<
    T extends Identifiable
> {
    list: T[];

    element(entry: T): ReactNode;
}

export default function DataTableActionColumn<
    T extends Identifiable
>(props: DataTableActionColumnProps<T>) {
    const { setActionColumn } = useContext<DataTableContextType<T>>(DataTableContext);

    useEffect(() => {
        setActionColumn(props);
    }, [ props, setActionColumn ]);

    return null;
}
