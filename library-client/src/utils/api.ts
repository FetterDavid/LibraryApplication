type ApiRequestMethod = "GET" | "POST" | "PUT" | "DELETE"

export async function apiRequest<ResponseType = void>(
    path: string, method: ApiRequestMethod, body?: any
): Promise<ResponseType> {
    const apiOrigin = process.env["REACT_APP_API_ORIGIN"];
    if (!apiOrigin) {
        throw new Error("Nem lehet megtalálni az API-t, mert a REACT_APP_API_ORIGIN" +
            " környezeti változó nincs beállítva.");
    }

    const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
    const url = `https://${ apiOrigin }/${ normalizedPath }`;
    const response = await fetch(url, {
        method, body: !!body ? JSON.stringify(body) : undefined,
        headers: { "Content-Type": "application/json" }
    });

    if (!response.ok) {
        throw new Error(await response.text());
    }

    if (response.headers.has("Content-Type") &&
        response.headers.get("Content-Type")!.includes("application/json")) {
        return await response.json() as ResponseType;
    }

    return undefined as ResponseType;
}
