# Front-End Framework Research: Mobile Train Tracker App

## Executive Summary

This document provides a recommendation for the front-end framework to use for the train-tracker-api mobile application.

## Recommendation: React Native with Expo

### Why React Native?

1. **Cross-Platform**: Write once, deploy to both iOS and Android
2. **JavaScript/TypeScript**: Seamless integration with our existing TypeScript backend
3. **Existing Codebase**: The `train-tracker-web` repo already uses TypeScript
4. **Ecosystem**: Large community, extensive libraries, and mature tooling

### Comparison: Swift vs React Native

| Criteria | Swift (iOS Native) | React Native | Winner |
|----------|-------------------|--------------|--------|
| Cross-platform | ❌ No | ✅ Yes | React Native |
| Development speed | ⚠️ Medium | ✅ Fast | React Native |
| TypeScript support | ⚠️ Partial (SwiftUI) | ✅ Full | React Native |
| Code sharing | ❌ Limited | ✅ High | React Native |
| PTV API integration | ✅ Direct | ✅ Direct | Tie |
| Performance | ✅ Excellent | ✅ Good | Swift |
| Learning curve | ⚠️ Steeper | ✅ Moderate | React Native |
| Maintenance | 2x (separate codebases) | 1x | React Native |

### Implementation Approach

1. **Framework**: React Native with Expo
2. **Language**: TypeScript (matching backend)
3. **State Management**: React Query for server state, Zustand for local state
4. **Navigation**: React Navigation
5. **HTTP Client**: Axios (same as backend patterns)
6. **UI Components**: React Native Paper (Material Design)

### Data to Display (Based on Backend Entities)

From the existing `Departure` entity:
- Station name and direction
- Platform number
- Scheduled vs Estimated departure times
- Delay information (in minutes)
- Route name and ID

### Next Steps

1. Initialize Expo project in `train-tracker-web`
2. Set up navigation structure
3. Create API service to connect to `train-tracker-api`
4. Build core screens: Station List, Departures, Settings
5. Implement push notifications for delays

### Timeline Estimate

- **Week 1**: Project setup, API integration, basic UI
- **Week 2**: Station selection, departure list, real-time updates
- **Week 3**: Polish, testing, error handling
- **Week 4**: Build and deploy to TestFlight/Play Store

## Conclusion

**React Native with Expo** is the recommended choice due to:
- Cross-platform capabilities reducing development time by ~50%
- TypeScript consistency with existing backend
- Lower maintenance overhead
- Faster iteration cycles
