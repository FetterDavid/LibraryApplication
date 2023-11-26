import { Input } from "@material-tailwind/react";
import { DataEditLayoutComponentProps } from "@/utils/types";
import { AcquisitionEditData } from "@/acquisitions/types";
import { NumberInput } from "@/utils/components/inputs";
import { BookSelect } from "@/books/components";

export default function AcquisitionEditLayout(
    props: DataEditLayoutComponentProps<AcquisitionEditData>
) {
    return (
        <div className="w-full grid grid-cols-2 grid-rows-2 gap-2">
            <Input crossOrigin="" value={ props.data.acquisitionSource } onChange={ event => {
                props.onData({ ...props.data, acquisitionSource: event.target.value });
            } } label="Beszerés forrása" type="text" />
            <Input crossOrigin="" value={ props.data.acquisitionDate.toISOString().split("T")[0] }
                   onChange={ event => {
                       props.onData({
                           ...props.data,
                           acquisitionDate: new Date(event.target.value)
                       });
                   } } label="Beszerzés dátuma" type="date" />
            <NumberInput value={ props.data.price } onValue={ value => {
                props.onData({ ...props.data, price: value });
            } } label="Ár" />
            <BookSelect selected={ props.data.bookId } onSelect={ id => {
                props.onData({ ...props.data, bookId: id });
            } } />
        </div>
    );
}
