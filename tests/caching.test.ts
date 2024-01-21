import { Cache } from "../src/cache/cache.service"



describe('Caching tests',()=>{

    const cachingService = new Cache();

    test('Caching put and test',()=>{

        cachingService.put({
            key:"abc",
            body:"Anish",
            expiry: new Date('12/02/2024')
        });
    
        const cache = cachingService.get('abc');
    
        expect(cache).toStrictEqual({
            key:"abc",
            body:"Anish",
            expiry: new Date('12/02/2024'),
            createdAt: expect.any(Date)
        });

        cachingService.print();
    });

    test('Cache TTL hit test',()=>{
        cachingService.put({
            key:"abc2",
            body:"Anish",
            expiry: new Date('01-01-2024')
        });
        try{
            cachingService.get('abc2');
        }catch(e){
            expect(e.message).toBe('Cache Expired!');
        }

        cachingService.print();

    });

    test('Cache LRU hit test',()=>{
        cachingService.put({
            key:"abc3",
            body:"Anish1",
            expiry: new Date('12/02/2024')
        });
        cachingService.put({
            key:"abc4",
            body:"Anish2",
            expiry: new Date('12/02/2024')
        });
        cachingService.put({
            key:"abc5",
            body:"Anish3",
            expiry: new Date('12/02/2024')
        });
        cachingService.put({
            key:"abc6",
            body:"Anish3",
            expiry: new Date('12/02/2024')
        });
        try{
            const a = cachingService.get('abc');
        }catch(e){
            expect(e.message).toBe('Cache not found');
        }
        const cache = cachingService.get('abc4');
        expect(cache).toStrictEqual({
            key:"abc4",
            body:"Anish2",
            expiry: new Date('12/02/2024'),
            createdAt: expect.any(Date)
        });

        cachingService.print();

    });
})