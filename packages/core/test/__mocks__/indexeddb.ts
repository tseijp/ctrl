/**
 * Mock implementation of IndexedDB for testing
 */

// Mock storage for IndexedDB
const mockStorage = new Map<string, Map<string, any>>()

// Mock IDBFactory
export const mockIndexedDB = {
        // Databases
        databases: new Map<string, any>(),

        // Open database
        open: jest.fn().mockImplementation((name: string, version: number) => {
                const request = {
                        result: null as any,
                        error: null as Error | null,
                        onupgradeneeded: null as ((event: any) => void) | null,
                        onsuccess: null as ((event: any) => void) | null,
                        onerror: null as ((event: any) => void) | null,
                        transaction: null as any,
                }

                // Create database if it doesn't exist
                if (!mockStorage.has(name)) {
                        mockStorage.set(name, new Map())
                }

                // Create mock database
                const db = {
                        name,
                        version,
                        objectStoreNames: {
                                contains: (storeName: string) =>
                                        mockStorage.get(name)?.has(storeName) ||
                                        false,
                                item: (index: number) => {
                                        const stores = Array.from(
                                                mockStorage.get(name)?.keys() ||
                                                        []
                                        )
                                        return stores[index] || null
                                },
                                length: mockStorage.get(name)?.size || 0,
                        },
                        createObjectStore: jest
                                .fn()
                                .mockImplementation(
                                        (storeName: string, options: any) => {
                                                if (
                                                        !mockStorage
                                                                .get(name)
                                                                ?.has(storeName)
                                                ) {
                                                        mockStorage
                                                                .get(name)
                                                                ?.set(
                                                                        storeName,
                                                                        new Map()
                                                                )
                                                }

                                                return {
                                                        name: storeName,
                                                        keyPath:
                                                                options?.keyPath ||
                                                                null,
                                                        autoIncrement:
                                                                options?.autoIncrement ||
                                                                false,
                                                        put: jest
                                                                .fn()
                                                                .mockImplementation(
                                                                        (
                                                                                value: any,
                                                                                key?: any
                                                                        ) => {
                                                                                const store =
                                                                                        mockStorage
                                                                                                .get(
                                                                                                        name
                                                                                                )
                                                                                                ?.get(
                                                                                                        storeName
                                                                                                )
                                                                                const useKey =
                                                                                        key ||
                                                                                        (options?.keyPath
                                                                                                ? value[
                                                                                                          options
                                                                                                                  .keyPath
                                                                                                  ]
                                                                                                : null)

                                                                                if (
                                                                                        !useKey
                                                                                ) {
                                                                                        throw new Error(
                                                                                                'No key provided and no keyPath defined'
                                                                                        )
                                                                                }

                                                                                store?.set(
                                                                                        useKey,
                                                                                        value
                                                                                )

                                                                                return {
                                                                                        result: useKey,
                                                                                        onsuccess: null as
                                                                                                | ((
                                                                                                          event: any
                                                                                                  ) => void)
                                                                                                | null,
                                                                                }
                                                                        }
                                                                ),
                                                        get: jest
                                                                .fn()
                                                                .mockImplementation(
                                                                        (
                                                                                key: any
                                                                        ) => {
                                                                                const store =
                                                                                        mockStorage
                                                                                                .get(
                                                                                                        name
                                                                                                )
                                                                                                ?.get(
                                                                                                        storeName
                                                                                                )
                                                                                const value =
                                                                                        store?.get(
                                                                                                key
                                                                                        )

                                                                                const request =
                                                                                        {
                                                                                                result: value,
                                                                                                onsuccess: null as
                                                                                                        | ((
                                                                                                                  event: any
                                                                                                          ) => void)
                                                                                                        | null,
                                                                                        }

                                                                                // Simulate async behavior
                                                                                setTimeout(
                                                                                        () => {
                                                                                                if (
                                                                                                        request.onsuccess
                                                                                                ) {
                                                                                                        request.onsuccess(
                                                                                                                {
                                                                                                                        target: request,
                                                                                                                }
                                                                                                        )
                                                                                                }
                                                                                        },
                                                                                        0
                                                                                )

                                                                                return request
                                                                        }
                                                                ),
                                                        delete: jest
                                                                .fn()
                                                                .mockImplementation(
                                                                        (
                                                                                key: any
                                                                        ) => {
                                                                                const store =
                                                                                        mockStorage
                                                                                                .get(
                                                                                                        name
                                                                                                )
                                                                                                ?.get(
                                                                                                        storeName
                                                                                                )
                                                                                store?.delete(
                                                                                        key
                                                                                )

                                                                                return {
                                                                                        onsuccess: null as
                                                                                                | ((
                                                                                                          event: any
                                                                                                  ) => void)
                                                                                                | null,
                                                                                }
                                                                        }
                                                                ),
                                                        clear: jest
                                                                .fn()
                                                                .mockImplementation(
                                                                        () => {
                                                                                const store =
                                                                                        mockStorage
                                                                                                .get(
                                                                                                        name
                                                                                                )
                                                                                                ?.get(
                                                                                                        storeName
                                                                                                )
                                                                                store?.clear()

                                                                                return {
                                                                                        onsuccess: null as
                                                                                                | ((
                                                                                                          event: any
                                                                                                  ) => void)
                                                                                                | null,
                                                                                }
                                                                        }
                                                                ),
                                                        index: jest
                                                                .fn()
                                                                .mockImplementation(
                                                                        (
                                                                                indexName: string
                                                                        ) => {
                                                                                return {
                                                                                        name: indexName,
                                                                                        get: jest.fn(),
                                                                                        getAll: jest.fn(),
                                                                                }
                                                                        }
                                                                ),
                                                        createIndex: jest
                                                                .fn()
                                                                .mockImplementation(
                                                                        (
                                                                                indexName: string,
                                                                                keyPath: string,
                                                                                options: any
                                                                        ) => {
                                                                                return {
                                                                                        name: indexName,
                                                                                        keyPath,
                                                                                        unique:
                                                                                                options?.unique ||
                                                                                                false,
                                                                                        multiEntry:
                                                                                                options?.multiEntry ||
                                                                                                false,
                                                                                }
                                                                        }
                                                                ),
                                                }
                                        }
                                ),
                        transaction: jest
                                .fn()
                                .mockImplementation(
                                        (
                                                storeNames: string | string[],
                                                mode: string = 'readonly'
                                        ) => {
                                                const stores = Array.isArray(
                                                        storeNames
                                                )
                                                        ? storeNames
                                                        : [storeNames]

                                                const transaction = {
                                                        mode,
                                                        db,
                                                        objectStore: jest
                                                                .fn()
                                                                .mockImplementation(
                                                                        (
                                                                                storeName: string
                                                                        ) => {
                                                                                if (
                                                                                        !stores.includes(
                                                                                                storeName
                                                                                        )
                                                                                ) {
                                                                                        throw new Error(
                                                                                                `Object store ${storeName} not in transaction`
                                                                                        )
                                                                                }

                                                                                if (
                                                                                        !mockStorage
                                                                                                .get(
                                                                                                        name
                                                                                                )
                                                                                                ?.has(
                                                                                                        storeName
                                                                                                )
                                                                                ) {
                                                                                        mockStorage
                                                                                                .get(
                                                                                                        name
                                                                                                )
                                                                                                ?.set(
                                                                                                        storeName,
                                                                                                        new Map()
                                                                                                )
                                                                                }

                                                                                return {
                                                                                        name: storeName,
                                                                                        put: jest
                                                                                                .fn()
                                                                                                .mockImplementation(
                                                                                                        (
                                                                                                                value: any,
                                                                                                                key?: any
                                                                                                        ) => {
                                                                                                                const store =
                                                                                                                        mockStorage
                                                                                                                                .get(
                                                                                                                                        name
                                                                                                                                )
                                                                                                                                ?.get(
                                                                                                                                        storeName
                                                                                                                                )
                                                                                                                const useKey =
                                                                                                                        key ||
                                                                                                                        value.id
                                                                                                                store?.set(
                                                                                                                        useKey,
                                                                                                                        value
                                                                                                                )

                                                                                                                const request =
                                                                                                                        {
                                                                                                                                result: useKey,
                                                                                                                                onsuccess: null as
                                                                                                                                        | ((
                                                                                                                                                  event: any
                                                                                                                                          ) => void)
                                                                                                                                        | null,
                                                                                                                        }

                                                                                                                // Simulate async behavior
                                                                                                                setTimeout(
                                                                                                                        () => {
                                                                                                                                if (
                                                                                                                                        request.onsuccess
                                                                                                                                ) {
                                                                                                                                        request.onsuccess(
                                                                                                                                                {
                                                                                                                                                        target: request,
                                                                                                                                                }
                                                                                                                                        )
                                                                                                                                }
                                                                                                                        },
                                                                                                                        0
                                                                                                                )

                                                                                                                return request
                                                                                                        }
                                                                                                ),
                                                                                        get: jest
                                                                                                .fn()
                                                                                                .mockImplementation(
                                                                                                        (
                                                                                                                key: any
                                                                                                        ) => {
                                                                                                                const store =
                                                                                                                        mockStorage
                                                                                                                                .get(
                                                                                                                                        name
                                                                                                                                )
                                                                                                                                ?.get(
                                                                                                                                        storeName
                                                                                                                                )
                                                                                                                const value =
                                                                                                                        store?.get(
                                                                                                                                key
                                                                                                                        )

                                                                                                                const request =
                                                                                                                        {
                                                                                                                                result: value,
                                                                                                                                onsuccess: null as
                                                                                                                                        | ((
                                                                                                                                                  event: any
                                                                                                                                          ) => void)
                                                                                                                                        | null,
                                                                                                                        }

                                                                                                                // Simulate async behavior
                                                                                                                setTimeout(
                                                                                                                        () => {
                                                                                                                                if (
                                                                                                                                        request.onsuccess
                                                                                                                                ) {
                                                                                                                                        request.onsuccess(
                                                                                                                                                {
                                                                                                                                                        target: request,
                                                                                                                                                }
                                                                                                                                        )
                                                                                                                                }
                                                                                                                        },
                                                                                                                        0
                                                                                                                )

                                                                                                                return request
                                                                                                        }
                                                                                                ),
                                                                                        delete: jest
                                                                                                .fn()
                                                                                                .mockImplementation(
                                                                                                        (
                                                                                                                key: any
                                                                                                        ) => {
                                                                                                                const store =
                                                                                                                        mockStorage
                                                                                                                                .get(
                                                                                                                                        name
                                                                                                                                )
                                                                                                                                ?.get(
                                                                                                                                        storeName
                                                                                                                                )
                                                                                                                store?.delete(
                                                                                                                        key
                                                                                                                )

                                                                                                                const request =
                                                                                                                        {
                                                                                                                                onsuccess: null as
                                                                                                                                        | ((
                                                                                                                                                  event: any
                                                                                                                                          ) => void)
                                                                                                                                        | null,
                                                                                                                        }

                                                                                                                // Simulate async behavior
                                                                                                                setTimeout(
                                                                                                                        () => {
                                                                                                                                if (
                                                                                                                                        request.onsuccess
                                                                                                                                ) {
                                                                                                                                        request.onsuccess(
                                                                                                                                                {
                                                                                                                                                        target: request,
                                                                                                                                                }
                                                                                                                                        )
                                                                                                                                }
                                                                                                                        },
                                                                                                                        0
                                                                                                                )

                                                                                                                return request
                                                                                                        }
                                                                                                ),
                                                                                        clear: jest
                                                                                                .fn()
                                                                                                .mockImplementation(
                                                                                                        () => {
                                                                                                                const store =
                                                                                                                        mockStorage
                                                                                                                                .get(
                                                                                                                                        name
                                                                                                                                )
                                                                                                                                ?.get(
                                                                                                                                        storeName
                                                                                                                                )
                                                                                                                store?.clear()

                                                                                                                const request =
                                                                                                                        {
                                                                                                                                onsuccess: null as
                                                                                                                                        | ((
                                                                                                                                                  event: any
                                                                                                                                          ) => void)
                                                                                                                                        | null,
                                                                                                                        }

                                                                                                                // Simulate async behavior
                                                                                                                setTimeout(
                                                                                                                        () => {
                                                                                                                                if (
                                                                                                                                        request.onsuccess
                                                                                                                                ) {
                                                                                                                                        request.onsuccess(
                                                                                                                                                {
                                                                                                                                                        target: request,
                                                                                                                                                }
                                                                                                                                        )
                                                                                                                                }
                                                                                                                        },
                                                                                                                        0
                                                                                                                )

                                                                                                                return request
                                                                                                        }
                                                                                                ),
                                                                                }
                                                                        }
                                                                ),
                                                        oncomplete: null as
                                                                | ((
                                                                          event: any
                                                                  ) => void)
                                                                | null,
                                                        onerror: null as
                                                                | ((
                                                                          event: any
                                                                  ) => void)
                                                                | null,
                                                        onabort: null as
                                                                | ((
                                                                          event: any
                                                                  ) => void)
                                                                | null,
                                                }

                                                return transaction
                                        }
                                ),
                        close: jest.fn(),
                }

                request.result = db

                // Simulate async behavior
                setTimeout(() => {
                        if (request.onupgradeneeded) {
                                request.onupgradeneeded({
                                        target: request,
                                        oldVersion: 0,
                                        newVersion: version,
                                })
                        }

                        if (request.onsuccess) {
                                request.onsuccess({ target: request })
                        }
                }, 0)

                return request
        }),

        // Delete database
        deleteDatabase: jest.fn().mockImplementation((name: string) => {
                mockStorage.delete(name)

                const request = {
                        onsuccess: null as ((event: any) => void) | null,
                        onerror: null as ((event: any) => void) | null,
                }

                // Simulate async behavior
                setTimeout(() => {
                        if (request.onsuccess) {
                                request.onsuccess({ target: request })
                        }
                }, 0)

                return request
        }),

        // Clear all mock data
        _reset: () => {
                mockStorage.clear()
        },

        // Get mock data for testing
        _getData: (dbName: string, storeName: string) => {
                return mockStorage.get(dbName)?.get(storeName)
        },
}

// Export mock IndexedDB
export default mockIndexedDB
