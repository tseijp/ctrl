/**
 * Jest setup file for @tsei/ctrl
 */

// Mock browser globals
global.ResizeObserver = class ResizeObserver {
        observe() {}
        unobserve() {}
        disconnect() {}
}

// Mock requestAnimationFrame
global.requestAnimationFrame = (callback: FrameRequestCallback): number => {
        return setTimeout(() => callback(Date.now()), 16) as unknown as number
}

// Mock cancelAnimationFrame
global.cancelAnimationFrame = (id) => {
        clearTimeout(id)
}

// Mock matchMedia
global.matchMedia = jest.fn().mockImplementation((query) => {
        return {
                matches: false,
                media: query,
                onchange: null,
                addListener: jest.fn(),
                removeListener: jest.fn(),
                addEventListener: jest.fn(),
                removeEventListener: jest.fn(),
                dispatchEvent: jest.fn(),
        }
})

// Mock localStorage
const localStorageMock = (() => {
        let store: Record<string, string> = {}
        return {
                getItem: jest.fn((key: string) => store[key] || null),
                setItem: jest.fn((key: string, value: string) => {
                        store[key] = value.toString()
                }),
                removeItem: jest.fn((key: string) => {
                        delete store[key]
                }),
                clear: jest.fn(() => {
                        store = {}
                }),
        }
})()

Object.defineProperty(window, 'localStorage', {
        value: localStorageMock,
})

// Mock IndexedDB
const mockIndexedDB = {
        open: jest.fn(),
        deleteDatabase: jest.fn(),
}

Object.defineProperty(window, 'indexedDB', {
        value: mockIndexedDB,
})

// Mock WebRTC
const mockRTCPeerConnection = jest.fn().mockImplementation(() => ({
        createOffer: jest.fn().mockResolvedValue({}),
        createAnswer: jest.fn().mockResolvedValue({}),
        setLocalDescription: jest.fn().mockResolvedValue({}),
        setRemoteDescription: jest.fn().mockResolvedValue({}),
        addIceCandidate: jest.fn().mockResolvedValue({}),
        close: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
}))

Object.defineProperty(window, 'RTCPeerConnection', {
        value: mockRTCPeerConnection,
})

// Mock SkyWay SDK
jest.mock('@skyway-sdk/room', () => ({
        SkyWayContext: jest.fn().mockImplementation(() => ({
                dispose: jest.fn().mockResolvedValue({}),
        })),
        SkyWayRoom: jest.fn().mockImplementation(() => ({
                create: jest.fn().mockResolvedValue({}),
                findOrCreate: jest.fn().mockResolvedValue({}),
        })),
        LocalP2PRoomMember: jest.fn().mockImplementation(() => ({
                publish: jest.fn().mockReturnValue({}),
                subscribe: jest.fn().mockReturnValue({
                        onData: jest.fn(),
                }),
                onPublicationListChanged: jest.fn(),
                onStreamPublished: jest.fn(),
                onDataPublished: jest.fn(),
        })),
}))

// Suppress console errors during tests
const originalConsoleError = console.error
console.error = (...args) => {
        // Ignore specific errors
        if (
                args[0]?.includes?.('Warning:') ||
                args[0]?.includes?.('Error:') ||
                args[0]?.includes?.('Not implemented:')
        ) {
                return
        }
        originalConsoleError(...args)
}

// Cleanup after all tests
afterAll(() => {
        console.error = originalConsoleError
})
