/**
 * Tests for the save helper
 */

import { save, indexed } from '../../src/helpers/save'
import { mockIndexedDB } from '../__mocks__/indexeddb'

// Mock IndexedDB
Object.defineProperty(window, 'indexedDB', {
        value: mockIndexedDB,
        writable: true,
})

describe('save helper', () => {
        beforeEach(() => {
                // Reset the mock IndexedDB
                mockIndexedDB._reset()
                jest.clearAllMocks()
        })

        describe('indexed', () => {
                it('should open a database connection', async () => {
                        // Create an indexed DB instance
                        const db = indexed()

                        // Call open
                        await db.open()

                        // Check that indexedDB.open was called with the correct parameters
                        expect(mockIndexedDB.open).toHaveBeenCalledWith(
                                'IDB',
                                1
                        )
                })

                it('should create an object store if needed', async () => {
                        // Reset the mock implementation to use the default
                        mockIndexedDB.open.mockClear()

                        // Create an indexed DB instance
                        const db = indexed('test-store')

                        // Call open
                        await db.open()

                        // Check that createObjectStore was called
                        expect(
                                mockIndexedDB.open.mock.results[0].value.result
                                        .createObjectStore
                        ).toHaveBeenCalledWith('test-store', { keyPath: 'key' })
                })

                it('should set a value in the database', async () => {
                        // Reset the mock implementation to use the default
                        mockIndexedDB.open.mockClear()

                        // Create an indexed DB instance
                        const db = indexed<{ test: string }>('test-store')

                        // Call set with a key and value
                        await db.set('test', 'test-value')

                        // Get the mock data to verify it was stored
                        const storeData = mockIndexedDB._getData(
                                'IDB',
                                'test-store'
                        )

                        // Check that the data was stored correctly
                        expect(storeData?.get('test')).toEqual({
                                key: 'test',
                                value: 'test-value',
                        })
                })

                it('should get a value from the database', async () => {
                        // Reset the mock implementation to use the default
                        mockIndexedDB.open.mockClear()

                        // Set up test data
                        const testDb = indexed<{ test: string }>('test-store')
                        await testDb.set('test', 'test-value')

                        // Create a new indexed DB instance
                        const db = indexed<{ test: string }>('test-store')

                        // Call one with a key
                        const result = await db.one('test')

                        // Check that the result is correct
                        expect(result).toEqual('test-value')
                })
        })

        describe('save', () => {
                it('should create a save object with the correct properties', () => {
                        // Create a save object
                        const target = { test: 'test-value' }
                        const s = save(target, 'test-store')

                        // Check that the save object has the correct properties
                        expect(s).toHaveProperty('events')
                        expect(s).toHaveProperty('writes')
                        expect(s).toHaveProperty('actors')
                        expect(s).toHaveProperty('mounts')
                        expect(s).toHaveProperty('cleans')
                        expect(s).toHaveProperty('mount')
                        expect(s).toHaveProperty('clean')
                        expect(s).toHaveProperty('sub')
                        expect(s).toHaveProperty('act')
                        expect(s).toHaveProperty('run')
                        expect(s).toHaveProperty('set')
                        expect(s).toHaveProperty('get')
                        expect(s).toHaveProperty('current')
                        expect(s).toHaveProperty('idb')
                        expect(s).toHaveProperty('isC')
                })

                it('should set a value and update the target', () => {
                        // Create a save object
                        const target = { test: 'test-value' }
                        const s = save(target, 'test-store')

                        // Set a new value
                        s.set('test', 'new-value')

                        // Check that the target was updated
                        expect(target.test).toBe('new-value')
                })

                it('should run a value and call the write function', () => {
                        // Create a save object
                        const target = { test: 'test-value' }
                        const s = save(target, 'test-store')

                        // Mock the idb.set method
                        const mockSet = jest.fn()
                        s.idb.set = mockSet

                        // Add a write function
                        const mockWrite = jest.fn()
                        s.writes.add(mockWrite)

                        // Run a new value
                        s.run('test', 'new-value')

                        // Check that idb.set was called
                        expect(mockSet).toHaveBeenCalledWith(
                                'test',
                                'new-value'
                        )

                        // Check that the write function was called
                        expect(mockWrite).toHaveBeenCalledWith(
                                'test',
                                'new-value'
                        )
                })

                it('should subscribe and call the actor function', () => {
                        // Create a save object
                        const target = { test: 'test-value' }
                        const s = save(target, 'test-store')

                        // Mock the mount method
                        s.mount = jest.fn()

                        // Subscribe with an actor function
                        const mockActor = jest.fn()
                        const unsubscribe = s.sub(mockActor)

                        // Check that the actor was added
                        expect(s.actors.has(mockActor)).toBe(true)

                        // Check that mount was called
                        expect(s.mount).toHaveBeenCalled()

                        // Call act to trigger the actor
                        s.act()

                        // Check that the actor was called
                        expect(mockActor).toHaveBeenCalled()

                        // Unsubscribe
                        unsubscribe()

                        // Check that the actor was removed
                        expect(s.actors.has(mockActor)).toBe(false)
                })
        })
})
