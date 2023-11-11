import { useContext } from "react";
import { LibraryContext } from "@/library/index";

export function useLibraryFromContext() {
    return useContext(LibraryContext);
}
