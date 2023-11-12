import { ReactElement, ReactNode, useCallback, useState } from "react";
import { Card, Typography } from "@material-tailwind/react";
import { typedObjectKeys } from "@/utils/lib";
import { Identifiable } from "@/utils/types";
import { DataTableDataColumnProps } from "@/utils/components/data-table/DataTableDataColumn";
import { DataTableActionColumnProps } from "@/utils/components/data-table/DataTableActionColumn";
import { DataTableContextType } from "@/utils/components/data-table/DataTableContext";
import { DataTableContext } from "@/utils/components/data-table/index";

export type DataTableChildren<T extends Identifiable> =
    (ReactElement<DataTableDataColumnProps<T>> |
        ReactElement<DataTableActionColumnProps<T>>)[] |
    ReactElement<DataTableDataColumnProps<T>>

export interface DataTableProps<T extends Identifiable> {
    dataList: T[];
    loadAllInOnePage?: boolean;
    propertyNameOverride?: { [key in keyof T]?: string };
    excludedProperties?: (keyof T)[];
    actionColumn?: (entry: T) => ReactNode;
    children: DataTableChildren<T>;
    noElementsText?: string;
}

export default function DataTable<T extends Identifiable>(props: DataTableProps<T>) {
    const [ headers, setHeaders ] = useState<{ [key in keyof T]?: string }>({});
    const [ rows, setRows ] = useState<{ [key in keyof T]?: ReactNode }[]>(
        props.dataList.map(value => {
            return { id: value.id };
        })
    );
    const [ actionRowCells, setActionRowCells ] = useState<ReactNode[]>();

    const doSetDataColumn = useCallback<DataTableContextType<T>["setDataColumn"]>(options => {
        setHeaders(prevState => {
            (prevState as any)[options.forKey] = options.header ?? options.forKey;
            return prevState;
        });

        setRows(prevState => props.dataList.map((value, index) => {
            if (!prevState[index]) prevState.push({});
            return {
                ...prevState[index],
                [options.forKey]: options.element(value[options.forKey])
            };
        }));
    }, [ props.dataList ]);

    const doSetActionColum = useCallback<DataTableContextType<T>["setActionColumn"]>(options => {
        setActionRowCells(props.dataList.map(value => options.element(value)));
    }, [ props.dataList ]);

    // noinspection com.haulmont.rcb.ArrayToJSXMapInspection
    return props.dataList.length === 0 ? (
        <div className="w-full h-24 grid place-content-center">
            <Typography variant="lead">
                { props.noElementsText ?? "Nincsenek elemek ebben a listában." }
            </Typography>
        </div>
    ) : (
        <DataTableContext.Provider value={ {
            list: props.dataList,
            setDataColumn: doSetDataColumn,
            setActionColumn: doSetActionColum
        } }>
            { props.children }
            <Card>
                <table className="table-auto rounded-md overflow-hidden border-collapse w-full">
                    <thead className="bg-gray-100 rounded-md border-b border-b-gray-400">
                    <tr className="h-12">
                        { typedObjectKeys(headers).map((key, index) => (
                            <th key={ index } className="text-start first:pl-4 last:pr-2 uppercase">
                                { headers[key] }
                            </th>
                        )) }
                        { !!actionRowCells ? (
                            <th className="text-start first:pl-4 last:pr-2 uppercase"></th>
                        ) : null }
                    </tr>
                    </thead>
                    <tbody className="overflow-x-scroll overflow-y-hidden">
                    { rows.map((entry, indexEntry) => (
                        <tr key={ indexEntry } className="h-12 even:bg-blue-gray-50">
                            { typedObjectKeys(entry).map((key, indexKey) => {
                                return props.excludedProperties?.includes(key) ? null : (
                                    <td key={ indexKey } className="px-1 first:pl-4 last:pr-4">
                                        { entry[key] }
                                    </td>
                                );
                            }) }
                            { !!actionRowCells ? (
                                <td className="px-1 first:pl-4 last:pr-4">
                                    <div className="w-full flex flex-row items-center
                                    justify-end gap-2">
                                        { actionRowCells[indexEntry] }
                                    </div>
                                </td>
                            ) : null }
                        </tr>
                    )) }
                    </tbody>
                </table>
            </Card>
        </DataTableContext.Provider>
    );
}
