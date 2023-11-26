import { DataEditLayoutComponentProps } from "@/utils/types";
import { BorrowingEditData } from "@/borrowing/types";
import { Checkbox, Input } from "@material-tailwind/react";
import { BookSelect } from "@/books/components";
import { MemberSelect } from "@/members/components";
import { useState } from "react";
import { NumberInput } from "@/utils/components/inputs";

export default function BorrowingEditLayout(
    props: DataEditLayoutComponentProps<BorrowingEditData>
) {
    const [ lateFeeEnabled, setLateFeeEnabled ] = useState(!!props.data.lateFee);

    return (
        <div className="w-full grid grid-cols-2 grid-rows-3 gap-2">
            <MemberSelect selected={ props.data.readerNumber } onSelect={ id => {
                props.onData({ ...props.data, readerNumber: id });
            } } />
            <BookSelect selected={ props.data.inventoryNumber } onSelect={ id => {
                props.onData({ ...props.data, inventoryNumber: id });
            } } />
            <Input crossOrigin="" value={ props.data.borrowDate.toISOString().split("T")[0] }
                   onChange={ event => {
                       props.onData({
                           ...props.data,
                           borrowDate: new Date(event.target.value)
                       });
                   } } label="Kölcsönzés kezdete" type="date" />
            <Input crossOrigin="" value={ props.data.returnDate.toISOString().split("T")[0] }
                   onChange={ event => {
                       props.onData({
                           ...props.data,
                           returnDate: new Date(event.target.value)
                       });
                   } } label="Kölcsönzés vége" type="date" />
            <Checkbox checked={ lateFeeEnabled } onChange={ event => {
                setLateFeeEnabled(event.target.checked);
            } } label="Könyv visszahozva" crossOrigin="" />
            <NumberInput value={ props.data.lateFee } onValue={ value => {
                props.onData({ ...props.data, lateFee: value });
            } } label="Késedelmi díj (Ft)" disabled={ !lateFeeEnabled } />
        </div>
    );
}
