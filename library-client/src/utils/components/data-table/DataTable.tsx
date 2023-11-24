import { ReactElement, ReactNode, useCallback, useMemo, useState } from "react";
import { Card, Typography } from "@material-tailwind/react";
import { typedObjectKeys } from "@/utils/lib";
import { Identifiable, OrderByDirection } from "@/utils/types";
import { DataTableDataColumnProps } from "@/utils/components/data-table/DataTableDataColumn";
import { DataTableActionColumnProps } from "@/utils/components/data-table/DataTableActionColumn";
import { DataTableContextType } from "@/utils/components/data-table/DataTableContext";
import { DataTableContext } from "@/utils/components/data-table/index";
import { MaterialSymbol } from "@/utils/components";

export type DataTableChildren<DataType extends Identifiable> =
    (ReactElement<DataTableDataColumnProps<DataType>> |
        ReactElement<DataTableActionColumnProps<DataType>>)[] |
    ReactElement<DataTableDataColumnProps<DataType>>

export interface DataTableProps<DataType extends Identifiable> {
    dataList: DataType[];
    children: DataTableChildren<DataType>;
    excludedProperties?: (keyof DataType)[];
    noElementsText?: string;
}

export default function DataTable<DataType extends Identifiable>(props: DataTableProps<DataType>) {
    const [ orderBy, setOrderBy ] = useState<[ keyof DataType, OrderByDirection ]>();
    const orderedDataList = useMemo<DataType[]>(() => {
        if (!orderBy) return props.dataList;

        return props.dataList.slice().sort((a, b) => {
            const propertyA = a[orderBy[0]], propertyB = b[orderBy[0]];

            if (typeof propertyA === "object" && typeof propertyB === "object") {
                if (!!(propertyA as any)["name"] && !!(propertyB as any)["name"]) {
                    return orderBy[1] === "asc" ?
                        ((propertyA as any)["name"] as string)
                            .localeCompare((propertyB as any)["name"] as string) :
                        ((propertyB as any)["name"] as string)
                            .localeCompare((propertyA as any)["name"] as string);
                }
            }

            // noinspection SuspiciousTypeOfGuard
            if (typeof propertyA === "string" && typeof propertyB === "string") {
                return orderBy[1] === "asc" ?
                    propertyA.localeCompare(propertyB) :
                    propertyB.localeCompare(propertyA);
            }

            // noinspection SuspiciousTypeOfGuard
            if (typeof propertyA === "number" && typeof propertyB === "number") {
                return orderBy[1] === "asc" ?
                    propertyA - propertyB :
                    propertyB - propertyA;
            }

            // noinspection SuspiciousTypeOfGuard
            if (typeof propertyA === "boolean" && typeof propertyB === "boolean") {
                return orderBy[1] === "asc" ?
                    Number(propertyA) - Number(propertyB) :
                    Number(propertyB) - Number(propertyA);
            }

            return 0;
        });
    }, [ orderBy, props.dataList ]);

    const [ headers, setHeaders ] = useState<{ [key in keyof DataType]?: string }>({});
    const [ rows, setRows ] = useState<{ [key in keyof DataType]?: ReactNode }[]>(
        orderedDataList.map(value => {
            return { id: value.id };
        })
    );
    const [ actionRowCells, setActionRowCells ] = useState<ReactNode[]>();

    const doSetDataColumn = useCallback<
        DataTableContextType<DataType>["setDataColumn"]
    >(options => {
        setHeaders(prevState => {
            (prevState as any)[options.forKey] = options.header ?? options.forKey;
            return prevState;
        });

        setRows(prevState => orderedDataList.map((value, index) => {
            if (!prevState[index]) prevState.push({});
            return {
                ...prevState[index],
                [options.forKey]: options.children(value[options.forKey])
            };
        }));
    }, [ orderedDataList ]);

    const doSetActionColum = useCallback<
        DataTableContextType<DataType>["setActionColumn"]
    >(options => {
        setActionRowCells(orderedDataList.map(value => options.children(value)));
    }, [ orderedDataList ]);

    // noinspection com.haulmont.rcb.ArrayToJSXMapInspection
    return orderedDataList.length === 0 ? (
        <div className="w-full h-24 grid place-content-center">
            <Typography variant="lead">
                { props.noElementsText ?? "Ebben a listában nincsenek elemek." }
            </Typography>
        </div>
    ) : (
        <DataTableContext.Provider value={ {
            list: orderedDataList,
            setDataColumn: doSetDataColumn,
            setActionColumn: doSetActionColum
        } }>
            { props.children }
            <Card shadow={ false } className="border">
                <table className="table-auto rounded-lg overflow-hidden border-collapse w-full">
                    <thead className="bg-gray-300 rounded-lg border-b border-b-gray-400">
                    <tr className="h-12">
                        { typedObjectKeys(headers).map((key, index) => (
                            <th key={ index } className="text-start first:pl-4 last:pr-2
                            cursor-pointer group" onClick={ () => {
                                setOrderBy(prevState => {
                                    if (!!prevState) {
                                        if (prevState[1] === "desc") return undefined;
                                        else return [ key, "desc" ];
                                    }

                                    return [ key, "asc" ];
                                });
                            } }>
                                <div className="w-full flex flex-row items-center
                                justify-start gap-2">
                                    <Typography className="group-hover:underline font-bold
                                    select-none uppercase">
                                        { headers[key] }
                                    </Typography>
                                    <MaterialSymbol name={
                                        !orderBy ? "" : orderBy[1] === "asc" ?
                                            "arrow_drop_down" : "arrow_drop_up" } className={
                                        !orderBy || orderBy[0] !== key
                                            ? "invisible" : "visible" } />
                                </div>
                            </th>
                        )) }
                        { !!actionRowCells ? (
                            <th className="text-start first:pl-4 last:pr-2 uppercase"></th>
                        ) : null }
                    </tr>
                    </thead>
                    <tbody className="overflow-x-scroll overflow-y-hidden">
                    { rows.map((entry, indexEntry) => (
                        <tr key={ indexEntry } className="h-12 even:bg-gray-100">
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
