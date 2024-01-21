

export interface Node<T>{
    key: string;
    value: T;
    prev: Node<T> | null;
    next: Node<T> | null;
}

export type ICache ={
    key:string;
    expiry: Date;
    createdAt: Date;
    body: any;
}

export type ICacheGetRequest = Omit<ICache,'|expiry|createdAt|body'>;

export type ICachePutRequest = Omit<ICache,'createdAt'>;

export type ICacheDeleteRequest = ICacheGetRequest;
