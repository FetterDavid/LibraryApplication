import { createContext } from "react";
import { DataTableDataColumnProps } from "./DataTableDataColumn";
import { DataTableActionColumnProps } from "./DataTableActionColumn";
import { Identifiable } from "@/utils/types";

export type DataTableContextType<
    T extends Identifiable,
> = {
    list: T[]
    setDataColumn(options: DataTableDataColumnProps<T>): void
    setActionColumn(options: DataTableActionColumnProps<T>): void
}

const DataTableContext = createContext<DataTableContextType<any>>({
    list: [],
    setDataColumn(): void {
    },
    setActionColumn(): void {
    }
});

export default DataTableContext;
