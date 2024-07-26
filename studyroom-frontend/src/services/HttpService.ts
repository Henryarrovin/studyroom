import apiClient from "./apiClient";

class HttpService {
    endpoint: string;
    constructor(endpoint: string) {
        this.endpoint = endpoint;
    }

    getAll<T> () {
        const Controller = new AbortController();
        const request = apiClient.get<T[]>(this.endpoint, { signal: Controller.signal });
        return { request, cancel: () => Controller.abort() };
    }

    getOne<T> (username: string) {
        return apiClient.get<T>(`${this.endpoint}/${username}`);
    }

    delete (id: number) {
        return apiClient.delete(`${this.endpoint}/${id}`);
    }

    create<T> (entity: T) {
        return apiClient.post(this.endpoint, entity);
    }

    update<T> (entity: T) {
        return apiClient.put(this.endpoint, entity);
    }
}

export const getAll = (endpoint: string) => new HttpService(endpoint);
export const getOne = (endpoint: string, username: string) => new HttpService(`${endpoint}/${username}`);
export const create = (endpoint: string) => new HttpService(endpoint);
