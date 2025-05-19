const bakeUrl = (path: string, params: Record<string, string>) => {
    const url = new URL(path, process.env.EXPO_PUBLIC_BASE_URL);
    url.search = new URLSearchParams(params).toString();
    return url.toString();
}

export type RestRes<D> = {
    status: number;
    data: D;
}

const handleResponse = async (response: Response): Promise<RestRes<any>> => {
    if (!response.ok) {
        let error;
        try {
            const errorData = await response.json() as any;
            error = errorData.error || `Request failed with status ${response.status}`;
        } catch (e) {
            error = `Request failed with status ${response.status}`;
        }
        return { status: response.status, data: error };
    }
    const data = await response.json();
    return { status: response.status, data: data };
};

const handleRequest = async (url: string, options: RequestInit): Promise<RestRes<any>> => {
    try {
        const response = await fetch(url, options);
        return handleResponse(response);
    } catch (error: any) {
        return {status: 500, data: null}
    }
};

export const get = async <T,>(path: string, params: Record<string, string> = {}): Promise<RestRes<T>> => {
    return handleRequest(bakeUrl(path, params), { method: 'GET' });
};

export const post = async <T,>(path: string, data: any = {}, params: Record<string, string> = {}): Promise<RestRes<T>> => {
    return handleRequest(bakeUrl(path, params), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
};

export const put = async <T,>(path: string, data: any, params: Record<string, string>): Promise<RestRes<T>> => {
    return handleRequest(bakeUrl(path, params), {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
};

export const del = async <T,>(path: string, params: Record<string, string>): Promise<RestRes<T>> => {
    return handleRequest(bakeUrl(path, params), { method: 'DELETE' });
};