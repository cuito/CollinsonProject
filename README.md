# CollinsonProject

A full-stack web application for ranking activities based on weather and marine conditions at a given location. This project was developed as part of the Collinson Technical Assessment.

## Project Overview

The application allows users to search for a destination using an address input with autocomplete functionality, and then displays a ranked list of four activities (Skiing, Surfing, Outdoor sightseeing, and Indoor sightseeing) based on 7-day weather and marine forecasts for that location.

### Features

- **Address Search**: Google Places Autocomplete integration for intuitive location selection
- **Weather-Based Activity Ranking**: Real-time activity suitability scoring based on:
  - Weather conditions (temperature, precipitation, cloud cover, wind speed, snowfall)
  - Marine conditions (wave height, wave period)
- **7-Day Forecast Analysis**: Rankings are calculated using averaged weather data over the next 7 days

## Architecture

### Monorepo Structure

The project uses a **Yarn workspace monorepo** to manage multiple packages:

```
CollinsonProject/
├── packages/
│   ├── backend/          # GraphQL API server
│   ├── frontend/         # React web application
│   └── types/            # Shared TypeScript types
└── package.json          # Root workspace configuration
```

**Design Choice**: A monorepo structure was chosen to:
- Share TypeScript types between frontend and backend (`@collinson/types` package)
- Simplify dependency management across packages
- Enable coordinated development and testing of the full stack
- Maintain type safety and consistency across boundaries

### Backend (`packages/backend`)

**Technology Stack:**
- **Node.js** with **Express** - Web server framework
- **Apollo Server** - GraphQL API server
- **TypeScript** - Type-safe development
- **Open-Meteo API** - Weather and marine data source

**Key Design Choices:**

1. **GraphQL over REST**: GraphQL provides a flexible API that allows the frontend to request exactly the data it needs. This is especially beneficial for future extensions where different queries might require different fields.

2. **Modular Schema Architecture**: The GraphQL schema is organized into modules (`helloworld`, `ranker`), each with its own type definitions and resolvers. This promotes:
   - Separation of concerns
   - Scalability as new features are added
   - Easier testing and maintenance

3. **Single Responsibility Resolvers**: The ranking logic is encapsulated in dedicated functions (`getOpenMeteo`, `rankActivities`, `getRankings`), making the code:
   - Testable in isolation
   - Easy to understand and modify
   - Reusable across different contexts

4. **Parallel API Calls**: Weather and marine data are fetched concurrently using `Promise.all()`, reducing overall request latency.

5. **7-Day Averaging**: Weather metrics are averaged over a week window, providing a more stable and representative ranking rather than just current conditions.

**Ranking Algorithm:**

The ranking system uses weighted scoring (0-100) for each activity:

- **Skiing**: Prioritizes cold temperatures (≤0°C), fresh snowfall, snow depth, low wind, and absence of rain
- **Surfing**: Optimizes for wave height (0.8-3m range), longer wave periods (8-16s), and lower wind speeds
- **Outdoor Sightseeing**: Favors mild temperatures (~20°C), low precipitation, minimal wind, and clear skies
- **Indoor Sightseeing**: Inversely correlated with outdoor conditions - better when weather is poor

### Frontend (`packages/frontend`)

**Technology Stack:**
- **React 19** - UI library with React Compiler enabled
- **TypeScript** - Type safety
- **Vite** - Fast development build tool
- **Google Maps JavaScript API** - Places autocomplete functionality
- **GraphQL Request** - Lightweight GraphQL client

**Key Design Choices:**

1. **Component-Based Architecture**: The UI is split into reusable components:
   - `AddressInput` - Handles address search with autocomplete
   - `RankingTable` - Displays activity rankings in a table format
   - Separation of components and their styles (CSS modules pattern)

2. **Functional Components with Hooks**: Modern React patterns using `useState` and `useEffect` for state management and side effects, providing:
   - Better performance with React Compiler
   - Clearer component logic
   - Easier testing

3. **Type Safety**: Shared types from `@collinson/types` package ensure consistency between frontend and backend data structures.

4. **Error Handling**: Comprehensive error handling in the `RankingTable` component with loading states and error messages for better user experience.

5. **Environment-Based Configuration**: Backend URL is configured via environment variables (`VITE_BACKEND_URL`), allowing different configurations for development and production.

6. **Accessibility**: Input fields include proper ARIA attributes (`aria-invalid`, `aria-describedby`) for better screen reader support.

### Shared Types (`packages/types`)

A dedicated package for TypeScript types shared between frontend and backend, ensuring:
- Type consistency across the application
- Single source of truth for data structures
- Compile-time safety for API contracts

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Yarn package manager
- Google Maps API key (for Places Autocomplete)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd CollinsonProject
```

2. Install dependencies:
```bash
yarn install
```

### Configuration

1. **Backend Environment Variables** (`packages/backend/.env`):
```env
PORT=4000
```

2. **Frontend Environment Variables** (`packages/frontend/.env`):
```env
VITE_BACKEND_URL=http://localhost:4000
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### Running the Application

**Development Mode** (runs both frontend and backend):
```bash
yarn dev
```

This will start:
- Backend server at `http://localhost:4000/api`
- Frontend development server (typically at `http://localhost:5173`)

**Or run individually:**

Backend only:
```bash
yarn backend:dev
```

Frontend only:
```bash
yarn frontend:dev
```

## Project Structure

```
CollinsonProject/
├── packages/
│   ├── backend/
│   │   ├── graphql/
│   │   │   ├── modules/
│   │   │   │   ├── helloworld/        # Example GraphQL module
│   │   │   │   └── ranker/            # Activity ranking module
│   │   │   ├── index.ts               # Schema composition
│   │   │   └── schema.ts              # Apollo Server setup
│   │   ├── app.ts                     # Express app configuration
│   │   └── index.ts                   # Server entry point
│   ├── frontend/
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── AddressInput/      # Address search component
│   │   │   │   └── RankingTable/      # Activity rankings display
│   │   │   ├── models/                # Type definitions and interfaces
│   │   │   ├── App.tsx                # Main application component
│   │   │   └── main.tsx               # Application entry point
│   │   └── loaders/
│   │       └── googleMapsLoader.ts    # Google Maps API loader
│   └── types/
│       └── src/
│           └── index.ts               # Shared TypeScript types
└── package.json                       # Root workspace config
```

## API Reference

### GraphQL Query

**Query**: `rank`

Get activity rankings for a location:

```graphql
query RankQuery($latitude: Float!, $longitude: Float!) {
  rank(latitude: $latitude, longitude: $longitude) {
    activity
    score
  }
}
```

**Parameters:**
- `latitude` (Float, required): Latitude of the location
- `longitude` (Float, required): Longitude of the location

**Returns:**
- Array of `ActivityScore` objects sorted by score (highest first)
  - `activity` (String): Name of the activity
  - `score` (Float): Suitability score from 0-100

## Technology Decisions

### Why Monorepo?
- Type sharing between frontend and backend ensures consistency
- Simplified dependency management
- Coordinated development workflow
- Easier code navigation and refactoring

### Why React Compiler?
- Automatic optimization of React components
- Reduces need for manual `useMemo` and `useCallback` optimizations
- Better performance with less code complexity

### Why Nodemon?
- Faster iteration during development

## Future Enhancements

Potential improvements and extensions:

- Add caching layer for weather data to reduce API calls
- Implement user authentication and saved locations
- Add more activities to the ranking system
- Enhanced error handling and retry logic
- Unit and integration tests
- Docker containerization for easy deployment
- CI/CD pipeline setup
