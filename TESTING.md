# @tsei/ctrl Unit Testing Plan

## Overview

This document outlines the comprehensive testing strategy for the @tsei/ctrl library. The testing approach follows clean architecture principles, ensuring that each component is tested in isolation with proper mocking of dependencies.

## Testing Architecture

The test suite is organized to mirror the source code structure, with tests for each major component:

```
packages/core/test/
├── __mocks__/           # Mock implementations for external dependencies
│   ├── indexeddb.ts     # Mock implementation of IndexedDB
│   └── webrtc.ts        # Mock implementation of WebRTC APIs
├── helpers/             # Tests for utility helpers
│   ├── ctrl.test.ts     # Tests for the core ctrl helper
│   ├── save.test.ts     # Tests for the save/load functionality
│   └── utils.test.ts    # Tests for utility functions
├── plugins/             # Tests for input plugins
│   ├── Audio.test.ts    # Tests for audio player plugin
│   ├── Bool.test.ts     # Tests for boolean input plugin
│   ├── Button.test.ts   # Tests for button plugin
│   ├── Char.test.ts     # Tests for text input plugin
│   ├── Color.test.ts    # Tests for color picker plugin
│   ├── Files.test.ts    # Tests for file input plugin
│   ├── Image.test.ts    # Tests for image display plugin
│   ├── Nested.test.ts   # Tests for nested controls plugin
│   ├── Null.test.ts     # Tests for null value display plugin
│   ├── Select.test.ts   # Tests for select dropdown plugin
│   ├── Video.test.ts    # Tests for video player plugin
│   └── num/             # Tests for numeric input plugins
│       ├── Float.test.ts # Tests for float input plugin
│       └── Vector.test.ts # Tests for vector input plugin
├── integration/         # Framework integration tests
│   └── react.test.tsx   # Tests for React integration
└── utils/               # Test utilities
    ├── fixtures.ts      # Test fixtures and sample data
    ├── setup.ts         # Jest setup file
    └── test-utils.ts    # Reusable test utilities
```

## Testing Strategy

### Unit Tests

Unit tests focus on testing individual components in isolation. Dependencies are mocked to ensure that tests are focused on the specific component being tested.

#### Core Components

- **ctrl**: Test the core controller functionality, including state management, event handling, and plugin integration.
- **save/load**: Test the persistence layer, ensuring data can be saved to and loaded from IndexedDB.
- **utils**: Test utility functions for correctness and edge cases.

#### Plugins

- **Audio**: Test audio player plugin for correct rendering, event handling, and state updates.
- **Bool**: Test boolean input plugin for correct rendering, event handling, and state updates.
- **Button**: Test button plugin for correct rendering, event handling, and state updates.
- **Char**: Test text input plugin for correct rendering, event handling, and state updates.
- **Color**: Test color picker plugin for correct color conversion, event handling, and state updates.
- **Files**: Test file input plugin for correct rendering, event handling, and state updates.
- **Float**: Test float input plugin for numeric validation, event handling, and state updates.
- **Image**: Test image display plugin for correct rendering, event handling, and state updates.
- **Nested**: Test nested controls plugin for correct rendering, event handling, and state updates.
- **Null**: Test null value display plugin for correct rendering and state updates.
- **Select**: Test select dropdown plugin for correct rendering, event handling, and state updates.
- **Vector**: Test vector input plugin for multi-dimensional input handling and state updates.
- **Video**: Test video player plugin for correct rendering, event handling, and state updates.

### Integration Tests

Integration tests focus on how components work together and with framework integrations.

- **React**: Test the React integration, ensuring that the controller works correctly with React's component lifecycle and state management.

## Testing Tools

- **Jest**: Primary testing framework
- **jsdom**: DOM environment for testing browser APIs
- **ts-jest**: TypeScript support for Jest

## Mock Implementations

### IndexedDB

The IndexedDB API is mocked to provide a consistent testing environment without requiring a real browser database. The mock implementation supports:

- Creating and opening databases
- Creating object stores
- Storing and retrieving data
- Transaction management

### WebRTC

WebRTC APIs are mocked to test peer-to-peer communication features without requiring actual network connections. The mock implementation supports:

- Creating peer connections
- Signaling
- Data channels

## Test Coverage Goals

The test suite aims to achieve at least 80% code coverage across all components, with a focus on:

- Core functionality: 90%+
- Plugin implementations: 85%+
- Framework integrations: 80%+

Coverage is measured using Jest's built-in coverage reporter, which tracks:

- Statement coverage
- Branch coverage
- Function coverage
- Line coverage

## Test Execution

Tests can be run using the following commands:

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- packages/core/test/helpers/ctrl.test.ts

# Run tests in watch mode during development
npm test -- --watch
```

## Continuous Integration

Tests are automatically run as part of the CI/CD pipeline to ensure code quality and prevent regressions. The pipeline:

1. Installs dependencies
2. Builds the project
3. Runs the test suite
4. Generates coverage reports
5. Fails the build if coverage thresholds are not met

## Best Practices

### Writing Tests

- Each test should focus on a single aspect of functionality
- Use descriptive test names that explain what is being tested
- Follow the Arrange-Act-Assert pattern
- Mock external dependencies
- Avoid test interdependence

### Mocking

- Use Jest's mocking capabilities for functions and modules
- Create dedicated mock implementations for complex browser APIs
- Reset mocks between tests to prevent test pollution

### Assertions

- Use specific assertions rather than generic equality checks
- Test both positive and negative cases
- Include edge cases and error handling

## Conclusion

This testing plan provides a comprehensive approach to ensuring the quality and reliability of the @tsei/ctrl library. By following clean architecture principles and focusing on both unit and integration testing, we can maintain high code quality and prevent regressions as the library evolves.
