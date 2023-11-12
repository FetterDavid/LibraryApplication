import { DataEditLayoutComponentProps } from "@/utils/types";
import { BookEditData } from "@/books/types";
import { Input } from "@material-tailwind/react";
import { AuthorSelect, CategorySelect, PublisherSelect } from "@/categorisation/components";
import { NumberInput } from "@/utils/components/inputs";

export default function BookEditLayout(props: DataEditLayoutComponentProps<BookEditData>) {
    return (
        <div className="w-full grid auto-rows-auto grid-cols-2 gap-2">
            <Input crossOrigin="" value={ props.data.title } onChange={ event => {
                props.onData({ ...props.data, title: event.target.value });
            } } label="Cím" containerProps={ {
                className: "col-start-1 col-span-full"
            } } />
            <AuthorSelect selected={ props.data.authorId }
                          onSelect={ id => {
                              props.onData({ ...props.data, authorId: id });
                          } } />
            <CategorySelect selected={ props.data.categoryId }
                            onSelect={ id => {
                                props.onData({ ...props.data, categoryId: id });
                            } } />
            <PublisherSelect selected={ props.data.publisherId }
                             onSelect={ id => {
                                 props.onData({ ...props.data, publisherId: id });
                             } } />
            <NumberInput value={ props.data.publicationYear } onValue={ value => {
                props.onData({ ...props.data, publicationYear: value });
            } } label="Kiadás éve" max={ new Date().getFullYear() } />
            <NumberInput value={ props.data.inventoryNumber } onValue={ value => {
                props.onData({ ...props.data, inventoryNumber: value });
            } } label="Leltári szám" />
        </div>
    );
}
