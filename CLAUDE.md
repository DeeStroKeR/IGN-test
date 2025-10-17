# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + Vite + AWS Amplify breathing exercises application with AI conversational support. The app helps users practice different breathing techniques (4-7-8 breathing, resonance breathing, and pursed lip breathing) and provides AI-powered conversations with Finn, the virtual assistant. Features include user authentication, profiles, guided breathing sessions, and conversation history tracking.

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
- **Database Models**:
  - **User**: Profile fields (name, gender, jobTitle, jobDescription, aboutMe, birthday, diagnosis) using DynamoDB
  - **Conversation**: AI chat history storage (title, transcript as JSON, messageCount, owner) using DynamoDB
- **Authorization**: Owner-based authorization model - users can only access their own data
- **Configuration**: Backend defined in `amplify/backend.ts`, data schema in `amplify/data/resource.ts`
- **AI Integration**: Soul Machines SDK for conversational AI with Finn virtual assistant

### Key Routing Structure
```
/ - Home page (AI conversation with Finn)
/profile - User profile page  
/chat-history - Conversation history with Finn
/breathe - Breathing exercises homepage
/breathe/478-breathing - 4-7-8 breathing technique
/breathe/resonance-breathing - Resonance breathing technique
/breathe/pursed-lip-breathing - Pursed lip breathing technique
```

### State Management
- Global user state managed via `UserContext` with actions for setUser, updateUser, clearUser, setLoading
- AWS Amplify Authenticator component wraps the entire app for authentication state
- Individual breathing pages manage their own timer/session state locally
- Conversation state managed in Home page component with real-time transcript tracking
- Soul Machines SDK handles AI conversation session management

### Styling Approach
- **Brand Colors**: Primary (#31839d blue), Accent (#ff8160 dark peach)
- **Branding**: "I Got This!" application name, iGT-PA Ltd copyright
- Material-UI theming configured in `src/theme.ts`
- Ant Design ConfigProvider with custom token overrides for brand colors
- Dark peach (#ff8160) used for buttons, headings, borders, and interactive elements
- CSS modules for component-specific styles
- Consistent design system across both UI libraries

## Development Notes

### AI Conversation Features
- **Finn Virtual Assistant**: Soul Machines SDK integration for AI conversations
- **Conversation Storage**: Real-time transcript tracking with JSON serialization to DynamoDB
- **Chat History**: Full-screen dedicated page (`/chat-history`) for browsing past conversations
- **Session Management**: Automatic conversation saving on session end
- **Transcript Format**: JSON array with `{source: "user"|"persona", text: string}` structure

### Component Organization
- **Home page** (`/src/pages/Home.tsx`): Main AI conversation interface with Finn
- **Chat History page** (`/src/pages/ChatHistory/ChatHistory.tsx`): Conversation browsing and viewing
- Breathing technique pages follow a consistent structure with Description and Timer components
- Shared components in `/src/components/` (Layout, DualRingLoader, Clock, etc.)
- Page-specific components nested within their respective page directories

### Data Flow
- User authentication managed by AWS Amplify Authenticator
- User profile data stored in Amplify with owner-based access (includes diagnosis field)
- Conversation data automatically saved to DynamoDB with proper JSON serialization
- Generate Amplify data client using `generateClient<Schema>()` for database operations
- TypeScript types generated from Amplify schema

### Adding New Features
- **New breathing techniques**: Create page under `/src/pages/`, add route in `main.tsx`
- **UI components**: Use existing Material-UI + Ant Design pattern, follow theme configuration with dark peach (#ff8160) accents
- **Backend data**: Modify schema in `amplify/data/resource.ts`, regenerate types
- **Conversation features**: Extend Soul Machines integration, modify conversation storage schema
- **Profile fields**: Add to User model schema and profile form components
- **Authentication**: Already configured for email login, extend auth config if needed

### Important Technical Notes
- **Conversation serialization**: Always use `JSON.stringify()` when saving transcripts to DynamoDB
- **Agent name**: Finn is the virtual assistant name (not Ava)
- **Color consistency**: Use #ff8160 (dark peach) for interactive elements and accents
- **Database authorization**: All models use owner-based access control

## File Structure Patterns
- Pages: `/src/pages/[PageName]/[PageName].tsx` with nested components
- Components: `/src/components/[ComponentName]/[ComponentName].tsx` 
- Contexts: `/src/contexts/[ContextName]Context.tsx`
- HTTP utilities: `/src/http/` for API clients
- Shared assets: `/src/assets/`