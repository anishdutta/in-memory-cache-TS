import { ICache, ICachePutRequest, Node } from "src/cache/cache.interfaces";
import { StorageProcessor } from "./storage.processor";

export class CacheStorage implements StorageProcessor<ICache>{

    private cacheMap: Map<string, { key:string, value: ICache; prev: Node<ICache> | null; next: Node<ICache> | null }> = new Map();
    private capacity: number;
    private head: Node<ICache> | null = null;
    private tail: Node<ICache> | null = null;

    constructor(capacity: number) {
        this.capacity = capacity;
    }


    get(key: string): ICache {
        const cache = this.cacheMap.get(key);
        if(!cache){
            throw new Error('Cache not found');
        }
        if(new Date().valueOf() > cache.value.expiry.valueOf()){
            this.deleteNode(cache);
            throw new Error('Cache Expired!');
        };
        return cache.value;
    }

    put(request: ICachePutRequest): boolean {
        const newNode = {
            value: {...request,createdAt: new Date()} as ICache,
            next: null,
            prev: null,
            key: request.key
        }
        if(this.cacheMap.get(request.key)){
            this.moveToHead(newNode)
            this.cacheMap.set(request.key,newNode);
        }
        else{
            if((this.cacheMap.size + 1) > this.capacity){
                this.deleteNode(this.tail.prev); //LRU Eviction policy
            }
            this.moveToHead(newNode);
            this.cacheMap.set(request.key,newNode);
        }
        return true
    }

    delete(request: string): boolean {
        return this.cacheMap.delete(request);
    }

    private moveToHead(newNode: Node<ICache> ){
        const temp = this.cacheMap.get(this.head?.next?.key);
        if(!this.head){
            this.head = {} as Node<ICache>
        }
        this.head.next = newNode;
        if(!this.tail){
            this.tail = {} as Node<ICache>
            this.tail.prev = newNode;
        }
        newNode.prev = this.head;
        newNode.next = temp || this.tail;
        if(temp){
            temp.prev = newNode;
            this.cacheMap.set(temp.key,temp);    
        }
    }

    private deleteNode(node: Node<ICache>){
        const next = node?.next?.key ? this.cacheMap.get(node.next.key) : undefined;
        if(!next?.key){ //means tail node
            if(!this.tail){
                this.tail = {} as Node<ICache>;
            }
            this.tail.prev = node.prev;
        }else{
            next.prev = node.prev;
            this.cacheMap.set(next.key,next);
        }
        const prev = this.cacheMap.get(node.prev.key);
        if(!prev){ //means head node
            if(this.head){
                this.head = {} as Node<ICache>;
            }
            this.head.next = next;
        }else{
            prev.next = next;
            this.cacheMap.set(prev.key,prev);
        }
        this.cacheMap.delete(node.key);
    }

    //[*] Debug purpose
    // printQueue(){
    //     console.log(this.head);
    //     console.log(this.tail);
    //     console.log(this.cacheMap);
    // }



}