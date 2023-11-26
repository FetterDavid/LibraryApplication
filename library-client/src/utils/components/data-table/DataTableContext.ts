import { createContext } from "react";
import { DataTableDataColumnProps } from "./DataTableDataColumn";
import { DataTableActionColumnProps } from "./DataTableActionColumn";
import { Identifiable } from "@/utils/types";

export type DataTableContextType<
    DataType extends Identifiable,
> = {
    list: DataType[]
    setDataColumn(options: DataTableDataColumnProps<DataType>): void
    setActionColumn(options: DataTableActionColumnProps<DataType>): void
}

const DataTableContext = createContext<DataTableContextType<any>>({
    list: [],
    setDataColumn(): void {
    },
    setActionColumn(): void {
    }
});

export default DataTableContext;
