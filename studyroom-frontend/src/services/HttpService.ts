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

const create = (endpoint: string) => new HttpService(endpoint);

export default create;