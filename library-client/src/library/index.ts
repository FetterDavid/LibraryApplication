import { createContext } from "react";
import { Library } from "@/library/types";

export const LibraryContext = createContext<Library>({
    books: undefined as any,
    categories: undefined as any,
    authors: undefined as any,
    publishers: undefined as any,
    members: undefined as any
});
