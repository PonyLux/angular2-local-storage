export declare class LocalStorageModule {}
export declare class LocalStorageService {

    isAvailable() : boolean;
    get(key: string) : any;
    set(key: string, value: any) : any;
    flush(keyToDelete: Array<string>): void;
    clear(): void;
    remove(key: string): void;
}
