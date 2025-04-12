/**
 * Mock implementation of WebRTC functionality for testing
 */

// Mock SkyWay SDK
export const mockSkyWaySDK = {
        SkyWayContext: class {
                constructor(options: any) {
                        // Store options for testing
                        this.options = options
                }

                options: any

                async dispose() {
                        // Mock cleanup
                        return Promise.resolve()
                }
        },

        SkyWayRoom: class {
                constructor(context: any) {
                        this.context = context
                }

                context: any

                async create(options: any) {
                        return {
                                id: 'mock-room-id',
                                type: options.type || 'p2p',
                                name: options.name || 'mock-room',
                                ...options,
                        }
                }

                async findOrCreate(options: any) {
                        return {
                                id: 'mock-room-id',
                                type: options.type || 'p2p',
                                name: options.name || 'mock-room',
                                ...options,
                        }
                }
        },

        LocalP2PRoomMember: class {
                constructor(options: any) {
                        this.id = options.id || 'mock-member-id'
                        this.name = options.name || 'mock-member'
                        this.metadata = options.metadata || {}
                }

                id: string
                name: string
                metadata: any

                publish(data: any) {
                        // Return a mock publication
                        return {
                                id: 'mock-publication-id',
                                contentType: 'data',
                                metadata: {},
                                data,
                        }
                }

                subscribe(publicationId: string) {
                        // Return a mock subscription
                        return {
                                id: 'mock-subscription-id',
                                publication: {
                                        id: publicationId,
                                        contentType: 'data',
                                        metadata: {},
                                },
                                onData: jest.fn(),
                        }
                }

                onPublicationListChanged = jest.fn()
                onStreamPublished = jest.fn()
                onDataPublished = jest.fn()
        },
}

// Mock joined state
export const mockJoined = {
        room: {
                id: 'mock-room-id',
                name: 'mock-room',
                type: 'p2p',
                dispose: jest.fn().mockResolvedValue(undefined),
        },
        me: {
                id: 'mock-member-id',
                name: 'mock-member',
                metadata: {},
                publish: jest.fn().mockImplementation((data) => ({
                        id: 'mock-publication-id',
                        contentType: 'data',
                        metadata: {},
                        data,
                })),
                subscribe: jest.fn().mockImplementation((publicationId) => ({
                        id: 'mock-subscription-id',
                        publication: {
                                id: publicationId,
                                contentType: 'data',
                                metadata: {},
                        },
                        onData: jest.fn(),
                })),
                onPublicationListChanged: jest.fn(),
                onStreamPublished: jest.fn(),
                onDataPublished: jest.fn(),
        },
        data: {
                write: jest.fn(),
                read: jest.fn(),
        },
}

// Mock join function
export async function mockJoin(SKYWAY: any, set: Function, config: any) {
        // Store the set function for testing
        mockJoin.setFunction = set
        mockJoin.config = config

        // Return mock joined state
        return mockJoined
}

// Add properties to the mockJoin function for testing
mockJoin.setFunction = null as Function | null
mockJoin.config = null as any

// Export the mock join function as the default export
export default mockJoin
