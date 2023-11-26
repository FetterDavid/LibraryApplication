export function typedObjectKeys<T extends object>(obj: T): (keyof T)[] {
    return Object.keys(obj) as (keyof T)[];
}

export function contains(text: string, search: string): boolean {
    return text.toLocaleLowerCase().includes(search.toLocaleLowerCase());
}
