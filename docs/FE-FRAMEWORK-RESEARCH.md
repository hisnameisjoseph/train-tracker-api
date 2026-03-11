# Front-End Framework Research: Train Tracker Mobile App

## Executive Summary

This document evaluates React Native vs Swift for building a mobile app to display real-time train departure data from the PTV API.

**Recommendation: React Native** - Best for rapid development, cross-platform compatibility, and leveraging existing JavaScript/TypeScript expertise.

---

## Data Requirements

Based on the backend API (`train-tracker-api`), the mobile app needs to display:

### Core Entities
1. **Stations**
   - Name
   - PTV Station ID
   
2. **Departures**
   - Direction (destination)
   - Platform number
   - Scheduled departure time
   - Estimated departure time
   - Delay in minutes
   - Route ID and Route Name

---

## Framework Comparison

### React Native

| Criteria | Rating | Notes |
|----------|--------|-------|
| Development Speed | ⭐⭐⭐⭐⭐ | Single codebase for iOS/Android |
| Team Expertise | ⭐⭐⭐⭐⭐ | JavaScript/TypeScript aligns with NestJS backend |
| PTV API Integration | ⭐⭐⭐⭐⭐ | Native HTTP support, easy to call REST APIs |
| Real-time Updates | ⭐⭐⭐⭐ | WebSocket or polling support |
| Performance | ⭐⭐⭐⭐ | Good for data-heavy list views |
| App Store Process | ⭐⭐⭐⭐ | Standard review process |
| Offline Capability | ⭐⭐⭐⭐ | AsyncStorage, SQLite support |

**Pros:**
- Share logic/code with web frontend if needed
- Hot reload speeds up development
- Large ecosystem of libraries
- Easier to hire developers
- Faster time to market for MVP

**Cons:**
- Slight performance overhead vs native
- Native module sometimes needed for specific features

---

### Swift (iOS Native)

| Criteria | Rating | Notes |
|----------|--------|-------|
| Development Speed | ⭐⭐⭐ | Separate codebase for Android |
| Team Expertise | ⭐⭐⭐ | Requires Swift expertise |
| PTV API Integration⭐⭐⭐ | ⭐⭐ | Native URLSession |
| Real-time Updates | ⭐⭐⭐⭐⭐ | Native support |
| Performance | ⭐⭐⭐⭐⭐ | Best performance for animations |
| App Store Process | ⭐⭐⭐⭐ | Standard review process |
| Offline Capability | ⭐⭐⭐⭐⭐ | Native Core Data support |

**Pros:**
- Best performance and UX
- Full access to iOS APIs
- Better battery optimization

**Cons:**
- Android requires separate Kotlin codebase
- Longer initial development time
- Smaller pool of developers

---

## Recommendation

### Choose React Native if:
- Speed to market is priority
- Budget is limited (single codebase)
- Team has JavaScript/TypeScript experience
- Android support is needed
- MVP with core features is the goal

### Choose Swift if:
- iOS-only is a strict requirement
- Maximum performance is critical (complex animations)
- Team has native iOS expertise
- Long-term maintenance with dedicated iOS team

---

## Implementation Plan (React Native)

### Phase 1: MVP
1. Install Expo SDK
2. Create project structure
3. Implement PTV API service
4. Build station list screen
5. Build departure list screen
6. Add pull-to-refresh
7. Basic styling

### Phase 2: Enhanced Features
1. Search stations
2. Favorites/starred stations
3. Offline caching
4. Push notifications for delays

### Phase 3: Polish
1. Platform-specific UI
2. Animations
3. Performance optimization

---

## API Integration

The mobile app will consume these endpoints from the NestJS backend:

```
GET /station              - List all stations
GET /station/:id          - Get station details
GET /departure           - All departures
GET /departure/ptv/:ptvStationId  - By PTV station
GET /ptv/departures/:stopId       - Live PTV data
```

---

## Conclusion

For the Train Tracker API project, **React Native** is the recommended choice because:
1. The backend is already in TypeScript (NestJS)
2. Cross-platform support is likely needed
3. Faster development cycle
4. Easier to iterate and maintain

This research addresses the issue: "Research FE framework - Swift vs React native? How is the data going to be present on mobile?"
