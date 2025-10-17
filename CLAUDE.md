# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + Vite + AWS Amplify breathing exercises application that helps users practice different breathing techniques (4-7-8 breathing, resonance breathing, and pursed lip breathing). The app features user authentication, profiles, and guided breathing sessions.

## Development Commands

### Core Development
- `yarn dev` - Start development server with hot reload
- `yarn build` - Build for production (runs TypeScript check + Vite build)
- `yarn lint` - Run ESLint with TypeScript support
- `yarn preview` - Preview production build locally

### Backend/Amplify
- `npx ampx sandbox` - Start local Amplify backend sandbox (when available)
- `npx ampx generate` - Generate Amplify backend resources

## Architecture

### Frontend Structure
- **React Router v6** with nested routes structure in `src/main.tsx`
- **Material-UI** (`@mui/material`) and **Ant Design** (`antd`) for UI components - both are used simultaneously with custom theming
- **UserContext** (`src/contexts/UserContext.tsx`) for global user state management
- **Layout component** (`src/components/Layout.tsx`) wraps authenticated routes
- **Page-based architecture** with each breathing technique as a separate page under `/src/pages/`

### AWS Amplify Backend
- **Authentication**: Email-based login using AWS Cognito (configured in `amplify/auth/resource.ts`)
- **Database**: User model with profile fields (name, gender, jobTitle, jobDescription, aboutMe, birthday) using DynamoDB
- **Authorization**: Owner-based authorization model - users can only access their own data
- **Configuration**: Backend defined in `amplify/backend.ts`, data schema in `amplify/data/resource.ts`

### Key Routing Structure
```
/ - Home page
/profile - User profile page  
/breathe - Breathing exercises homepage
/breathe/478-breathing - 4-7-8 breathing technique
/breathe/resonance-breathing - Resonance breathing technique
/breathe/pursed-lip-breathing - Pursed lip breathing technique
```

### State Management
- Global user state managed via `UserContext` with actions for setUser, updateUser, clearUser, setLoading
- AWS Amplify Authenticator component wraps the entire app for authentication state
- Individual breathing pages likely manage their own timer/session state locally

### Styling Approach
- Material-UI theming configured in `src/theme.ts`
- Ant Design ConfigProvider with custom token overrides for brand colors (#31839d primary)
- CSS files for component-specific styles
- Consistent design system across both UI libraries

## Development Notes

### Component Organization
- Breathing technique pages follow a consistent structure with Description and Timer components
- Shared components in `/src/components/` (Wrapper, Toolbar, DualRingLoader, Clock, etc.)
- Page-specific components nested within their respective page directories

### Data Flow
- User authentication managed by AWS Amplify Authenticator
- User profile data stored in Amplify DataStore with owner-based access
- Generate Amplify data client using `generateClient<Schema>()` for database operations
- TypeScript types generated from Amplify schema

### Adding New Features
- New breathing techniques: Create page under `/src/pages/`, add route in `main.tsx`
- UI components: Use existing Material-UI + Ant Design pattern, follow theme configuration
- Backend data: Modify schema in `amplify/data/resource.ts`, regenerate types
- Authentication: Already configured for email login, extend auth config if needed

## File Structure Patterns
- Pages: `/src/pages/[PageName]/[PageName].tsx` with nested components
- Components: `/src/components/[ComponentName]/[ComponentName].tsx` 
- Contexts: `/src/contexts/[ContextName]Context.tsx`
- HTTP utilities: `/src/http/` for API clients
- Shared assets: `/src/assets/`