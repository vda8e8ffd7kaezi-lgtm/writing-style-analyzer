# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Writing Style Analyzer is an AI-powered tool that analyzes text to extract personal writing characteristics and outputs them in a markdown format suitable for AI prompts. The app uses Gemini AI 2.5 Flash model for analysis and follows Apple's Human Interface Guidelines for design.

**Key Features:**
- 2000-character text input limit
- AI-powered writing style analysis via Gemini AI
- localStorage-based history (max 5 items)
- Apple-style glassmorphism UI design
- Responsive design with 8-color theme system

## Essential Development Commands

```bash
# Start development server with Turbopack
npm run dev

# Build for production
npm run build

# Run all tests
npm run test

# Run tests once (CI mode)
npm run test:run

# Lint code
npm run lint

# Start production server
npm start
```

## Architecture & Core Concepts

### Tech Stack Architecture
- **Frontend**: Next.js 15 + React 19 + TypeScript
- **Styling**: Tailwind CSS 4.x (new configuration system)
- **AI Integration**: Google Gemini AI 2.5 Flash (server-side via API routes)
- **Testing**: Vitest + React Testing Library + jsdom
- **State Management**: React hooks + localStorage persistence

### API Route Architecture
The app uses Next.js API routes for secure server-side AI integration:
- `/api/analyze/route.ts` - Handles Gemini AI requests with XSS protection and input validation
- Client-side calls via `src/services/gemini.ts` use fetch to communicate with the API route
- API key (`GEMINI_API_KEY`) is securely stored server-side in `.env.local`

### Apple Design System Implementation
The codebase follows a comprehensive Apple-style design system:

**8-Color Theme System**: 
- Defined in `src/constants/theme-colors.ts` 
- Each theme has gradient classes, accent colors, and unique names
- Used throughout components for consistent visual hierarchy

**Glassmorphism Architecture**:
- Multi-layer background system (`BackgroundLayer.tsx`)
- `bg-white/40 backdrop-blur-sm` patterns for cards
- Fixed header with `bg-white/70 backdrop-blur-xl`

**Component Structure**:
- `src/app/page.tsx` - Main application state machine (input → analyzing → result)
- `src/components/` - Reusable UI components with Apple design patterns
- `src/constants/design-system.ts` - Centralized design tokens and constants

### State Management Pattern
The app uses a simple state machine pattern:
```typescript
type AppState = 'input' | 'analyzing' | 'result'
```
- `input`: Welcome screen with text input
- `analyzing`: Loading animation during AI processing  
- `result`: Display analysis results with navigation options

### Data Flow Architecture
1. User input → `TextInput` component (character validation)
2. Analysis request → `/api/analyze` route (server-side Gemini AI)
3. Result processing → `AnalysisResult` type with theme assignment
4. History persistence → `useAnalysisHistory` hook (localStorage)
5. Display → `AnalysisDisplay` component with copy functionality

## Tailwind CSS 4.x Configuration

This project uses Tailwind CSS 4.x with the new configuration system:
- Uses `@import "tailwindcss"` instead of `@tailwind` directives
- Configured through Vite plugin in `vite.config.ts`
- No `postcss.config.js` needed (handled by `@tailwindcss/vite`)

## Critical Implementation Details

### Security Features
- **XSS Protection**: HTML tags stripped in API route before AI processing
- **Input Validation**: Comprehensive validation for text length, type, and content
- **API Key Security**: Server-side only, never exposed to client

### Performance Optimizations
- **React Optimizations**: `useCallback` and `useMemo` for expensive operations
- **Component Architecture**: Memoized welcome section to prevent unnecessary rerenders
- **Build Optimization**: 116kB First Load JS with Next.js optimizations

### Accessibility Features
- **ARIA Attributes**: Proper labeling for screen readers
- **Keyboard Navigation**: Focus management and keyboard shortcuts
- **Visual Feedback**: Clear error states and loading indicators
- **WCAG 2.1 AA**: Color contrast and semantic HTML compliance

## Testing Strategy

Tests are organized by functionality:
- `src/hooks/__tests__/` - Custom hook testing
- `src/constants/__tests__/` - Utility function testing  
- `src/lib/__tests__/` - Library function testing

Key test files:
- `useAnalysisHistory.test.ts` - localStorage persistence testing
- `theme-colors.test.ts` - Color system validation
- `utils.test.ts` - Utility function validation

## Environment Variables

Required environment variable:
```bash
GEMINI_API_KEY="your-gemini-api-key-here"
```
Set in `.env.local` for development. The API key is used server-side only in the `/api/analyze` route.

## Common Development Patterns

### Adding New Components
Follow the Apple design system patterns:
- Use glassmorphism styles from `src/constants/design-system.ts`
- Implement hover states with `transform hover:scale-105 transition-all duration-200`
- Apply theme colors from the 8-color system
- Include proper TypeScript interfaces

### Error Handling Pattern
The app uses a consistent error handling approach:
- Client-side validation in components
- Server-side validation in API routes  
- User-friendly error messages with specific actions
- Fallback states for network/API failures

### localStorage Integration
Use the `useAnalysisHistory` hook for data persistence:
- Automatically manages 5-item limit
- Handles JSON serialization/deserialization
- Provides type-safe interfaces

This architecture ensures a maintainable, secure, and performant application that delivers a premium user experience following Apple's design principles.