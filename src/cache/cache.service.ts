import { CacheStorage } from "../storage/storage.model";
import { ICachePutRequest } from "./cache.interfaces";


export class Cache{
    storageCapacity = 3;
    storage: CacheStorage;

    constructor(){
        this.storage = new CacheStorage(this.storageCapacity);
    }

    get(key:string){
        const cache = this.storage.get(key);
        return cache;
    }

    put(request: ICachePutRequest){
        return this.storage.put(request);

    }

    delete(key:string){
        return this.storage.delete(key);
    }

    print(){
        this.storage.printQueue();
    }


}