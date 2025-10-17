# I Got This! 🌟

An AI-powered wellbeing application that combines breathing exercises with conversational support from Finn, your virtual wellness assistant.

## Overview

I Got This! is a comprehensive mental health and wellbeing platform built with React, AWS Amplify, and Soul Machines AI technology. The application provides users with guided breathing exercises, personalized AI conversations, and conversation history tracking to support their mental wellness journey.

## Features

### 🤖 AI Conversation Support
- **Finn Virtual Assistant**: Conversational AI powered by Soul Machines SDK
- **Real-time Chat**: Interactive conversations with empathetic AI responses
- **Conversation History**: Full tracking and storage of all conversations with Finn
- **Session Management**: Automatic saving of conversation transcripts to DynamoDB

### 🫁 Breathing Exercises
- **4-7-8 Breathing**: Classic relaxation technique with guided timer
- **Resonance Breathing**: Heart rate variability optimization
- **Pursed Lip Breathing**: Breathing control for anxiety management
- **Interactive Timers**: Visual and audio guidance for each technique

### 👤 User Management
- **Secure Authentication**: AWS Cognito-powered login system
- **User Profiles**: Comprehensive profile management with personal details
- **Accessibility Support**: Diagnosis field for formal diagnosis/disability information
- **Privacy Focused**: Owner-based data authorization ensuring user privacy

## Technical Architecture

### Frontend Stack
- **React 18** with TypeScript for type-safe development
- **Vite** for fast build tooling and hot module replacement
- **React Router v6** for client-side routing
- **Material-UI** and **Ant Design** for comprehensive UI components
- **Soul Machines SDK** for AI conversation integration

### Backend Services
- **AWS Amplify Gen 2** for full-stack development platform
- **Amazon Cognito** for user authentication and authorization
- **AWS AppSync** for GraphQL API management
- **Amazon DynamoDB** for scalable NoSQL database
- **Owner-based authorization** ensuring user data privacy

### Database Models
```typescript
User {
  id: string
  name: string
  gender: string
  birthday: string
  jobTitle: string
  jobDescription: string
  aboutMe: string
  diagnosis: string
  owner: string
}

Conversation {
  id: string
  title: string
  transcript: JSON
  messageCount: number
  owner: string
  createdAt: string
  updatedAt: string
}
```

## Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- AWS Account for deployment
- Soul Machines API credentials (for AI features)

### Local Development
```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# Run linting
yarn lint

# Build for production
yarn build
```

### Amplify Backend Setup
```bash
# Start local backend sandbox
npx ampx sandbox

# Generate backend resources
npx ampx generate
```

## Application Routes

- `/` - Home page with Finn AI conversation interface
- `/profile` - User profile management
- `/chat-history` - Browse conversation history with Finn
- `/breathe` - Breathing exercises homepage
- `/breathe/478-breathing` - 4-7-8 breathing technique
- `/breathe/resonance-breathing` - Resonance breathing technique
- `/breathe/pursed-lip-breathing` - Pursed lip breathing technique

## Design System

### Brand Colors
- **Primary Blue**: `#31839d` - Headers, navigation, primary buttons
- **Dark Peach**: `#ff8160` - Accent color, interactive elements, hover states
- **Text Colors**: Various grays for hierarchy and readability

### Typography
- Clean, accessible font stacks optimized for readability
- Consistent sizing scale across components
- High contrast ratios for accessibility compliance

## Key Features Implementation

### Conversation History
- Real-time transcript tracking during AI conversations
- JSON serialization for complex conversation data storage
- Full-screen dedicated page for browsing past conversations
- Modal-based conversation viewing with proper message formatting

### AI Integration
- Soul Machines SDK integration for natural conversation flow
- Automatic conversation saving on session end
- Proper error handling and connection management
- User and AI message differentiation with distinct styling

### Accessibility
- Diagnosis field in user profiles for accommodation needs
- High contrast color schemes
- Keyboard navigation support
- Screen reader compatible components

## Deployment

### AWS Amplify Deployment
The application is configured for seamless deployment through AWS Amplify:

1. **Automatic builds** triggered by Git commits
2. **Environment-specific** configurations
3. **CloudFormation** infrastructure as code
4. **CDN distribution** through CloudFront

For detailed deployment instructions, refer to the [AWS Amplify documentation](https://docs.amplify.aws/react/start/quickstart/#deploy-a-fullstack-app-to-aws).

## Development Guidelines

### Code Organization
- **Pages**: `/src/pages/[PageName]/[PageName].tsx`
- **Components**: `/src/components/[ComponentName]/[ComponentName].tsx`
- **Contexts**: `/src/contexts/[ContextName]Context.tsx`
- **Utilities**: `/src/http/` for API clients and utilities

### Best Practices
- Use TypeScript for all new code
- Follow component-based architecture
- Implement proper error boundaries
- Use CSS modules for styling
- Maintain consistent color usage (#ff8160 for accents)

## Support & Contact

- **Company**: iGT-PA Ltd
- **Support Email**: info@igt-pa.co.uk
- **Application**: "I Got This!" - Your AI-powered wellness companion

## License

This project is proprietary software owned by iGT-PA Ltd. All rights reserved.