import { ReactNode, useContext, useEffect } from "react";
import { DataTableContextType } from "@/utils/components/data-table/DataTableContext";
import { DataTableContext } from "@/utils/components/data-table/index";
import { Identifiable } from "@/utils/types";

export interface DataTableDataColumnProps<
    DataType extends Identifiable,
    DataTypeKey extends keyof DataType = keyof DataType
> {
    list: DataType[];
    forKey: DataTypeKey;
    header?: string;

    children(value: DataType[DataTypeKey]): ReactNode;
}

export default function DataTableDataColumn<
    DataType extends Identifiable,
    DataTypeKey extends keyof DataType = keyof DataType
>(props: DataTableDataColumnProps<DataType, DataTypeKey>) {
    const { setDataColumn } = useContext<DataTableContextType<DataType>>(DataTableContext);

    useEffect(() => {
        setDataColumn(props);
    }, [ props, setDataColumn ]);

    return null;
}
