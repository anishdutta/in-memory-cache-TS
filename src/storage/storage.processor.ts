import { ICache, ICacheDeleteRequest, ICacheGetRequest, ICachePutRequest } from "src/cache/cache.interfaces";

export interface StorageProcessor<T> {

    get (request: T | string) : ICache;

    put (request: ICachePutRequest): boolean;

    delete (request: T | string ): boolean;

}