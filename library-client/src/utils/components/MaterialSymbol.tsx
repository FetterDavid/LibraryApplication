import { ComponentClassNameProps } from "@/utils/types";

interface MaterialSymbolProps extends ComponentClassNameProps {
    name: string;
    containerClassName?: ComponentClassNameProps["className"];
}

export default function MaterialSymbol(props: MaterialSymbolProps) {
    return (
        <div className={ `w-[24px] h-full grid place-content-center
        ${ props.containerClassName ?? "" }` }>
            <span className={ `material-symbols-rounded ${ props.className ?? "" }` }>
                { props.name }
            </span>
        </div>
    );
}
