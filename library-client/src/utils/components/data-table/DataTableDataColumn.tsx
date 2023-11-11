import { ReactNode, useContext, useEffect } from "react";
import { DataTableContextType } from "@/utils/components/data-table/DataTableContext";
import { DataTableContext } from "@/utils/components/data-table/index";
import { Identifiable } from "@/utils/types";

export interface DataTableDataColumnProps<
    T extends Identifiable,
    K extends keyof T = keyof T
> {
    list: T[];
    forKey: K;
    header?: string;

    element(value: T[K]): ReactNode;
}

export default function DataTableDataColumn<
    T extends Identifiable,
    K extends keyof T = keyof T
>(props: DataTableDataColumnProps<T, K>) {
    const { setDataColumn } = useContext<DataTableContextType<T>>(DataTableContext);

    useEffect(() => {
        setDataColumn(props);
    }, [ props, setDataColumn ]);

    return null;
}
