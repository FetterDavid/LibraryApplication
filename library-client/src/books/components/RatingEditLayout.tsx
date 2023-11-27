import { DataEditLayoutComponentProps } from "@/utils/types";
import { RatingEditData } from "@/books/types";
import { MemberSelect } from "@/members/components";
import { BookSelect } from "@/books/components/index";
import { Input, Rating } from "@material-tailwind/react";

export default function RatingEditLayout(props: DataEditLayoutComponentProps<RatingEditData> & {
    disabled: "reader" | "book"
}) {
    return (
        <div className="grid grid-cols-2 grid-rows-2 gap-2">
            <MemberSelect selected={ props.data.readerNumber } onSelect={ id => {
                props.onData({ ...props.data, readerNumber: id });
            } } disabled={ props.disabled === "reader" } />
            <BookSelect selected={ props.data.inventoryNumber } onSelect={ id => {
                props.onData({ ...props.data, inventoryNumber: id });
            } } disabled={ props.disabled === "book" } />
            <Rating value={ props.data.point } onChange={ value => {
                props.onData({ ...props.data, point: value });
            } } />
            <Input crossOrigin="" value={ props.data.comment } onChange={ event => {
                props.onData({ ...props.data, comment: event.target.value });
            } } label="Megjegyzés" />
        </div>
    );
}
