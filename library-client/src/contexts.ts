import { createContext } from "react";
import { Library } from "@/library/types";

export const LibraryContext = createContext<Library>({
    books: undefined as any
});
