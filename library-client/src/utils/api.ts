type ApiRequestMethod = "GET" | "POST" | "PUT" | "DELETE"

export async function apiRequest<ResponseType extends object>(
    path: string, method: ApiRequestMethod, body?: any
): Promise<ResponseType> {
    const apiOrigin = process.env["REACT_APP_API_ORIGIN"];
    if (!apiOrigin) {
        throw new Error("Cannot find API origin, because the REACT_APP_API_ORIGIN environment" +
            "variable is not set.");
    }

    const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
    const url = `https://${ apiOrigin }/${ normalizedPath }`;
    const response = await fetch(url, { method, body });

    if (!response.ok) {
        throw new Error(await response.text());
    }

    return await response.json() as ResponseType;
}
