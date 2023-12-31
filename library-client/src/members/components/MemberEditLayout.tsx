import { DataEditLayoutComponentProps } from "@/utils/types";
import { MemberEditData } from "@/members/types";
import { Input } from "@material-tailwind/react";

export default function MemberEditLayout(props: DataEditLayoutComponentProps<MemberEditData>) {
    return (
        <div className="w-full flex flex-col items-stretch gap-2">
            <Input crossOrigin="" value={ props.data.name } onChange={ event => {
                props.onData({ ...props.data, name: event.target.value });
            } } label="Név" type="text" />
            <Input crossOrigin="" value={ props.data.email } onChange={ event => {
                props.onData({ ...props.data, email: event.target.value });
            } } label="E-mail cím" type="email" />
            <Input crossOrigin="" value={ props.data.membershipType } onChange={ event => {
                props.onData({ ...props.data, membershipType: event.target.value });
            } } label="Tagság típusa" type="text" />
        </div>
    );
}
