import { useContext } from "react";
import { LibraryContext } from "@/contexts";

export function useLibraryFromContext() {
    return useContext(LibraryContext);
}
