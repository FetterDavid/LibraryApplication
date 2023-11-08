import { HTMLAttributes, ReactNode } from "react";

export interface Identifiable {
    id: string;
}

export type Unidentifiable<T extends Identifiable> = Omit<T, "id">

export interface ComponentClassNameProps<ElemType extends HTMLElement = HTMLDivElement> {
    className?: HTMLAttributes<ElemType>["className"];
}

export interface ComponentChildrenProps {
    children: ReactNode;
}

export interface SelectComponentProps<T> extends ComponentClassNameProps {
    selected: T;
    disabled?: boolean;
    error?: boolean;

    onSelect(id: T): void;
}

export interface DataEditLayoutComponentProps<DataInType, DataOutType = DataInType> {
    data: DataInType;

    onData(data: DataOutType): void;
}
