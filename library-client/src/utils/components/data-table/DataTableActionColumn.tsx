import { ReactNode, useContext, useEffect } from "react";
import { DataTableContextType } from "@/utils/components/data-table/DataTableContext";
import { DataTableContext } from "@/utils/components/data-table/index";
import { Identifiable } from "@/utils/types";

export interface DataTableActionColumnProps<DataType extends Identifiable> {
    list: DataType[];

    children(entry: DataType): ReactNode;
}

export default function DataTableActionColumn<
    DataType extends Identifiable
>(props: DataTableActionColumnProps<DataType>) {
    const { setActionColumn } = useContext<DataTableContextType<DataType>>(DataTableContext);

    useEffect(() => {
        setActionColumn(props);
    }, [ props, setActionColumn ]);

    return null;
}
