# AI Voice Agent Interview Platform

A full-stack real-time AI voice agent interview platform built with Next.js, Tailwind CSS, Firebase, and Vapi.

## Features

- User authentication with Firebase
- Generate customized interview questions with Google Gemini AI
- Real-time voice interviews with AI using Vapi
- Detailed feedback on interview performance
- Track past interviews and progress

## Tech Stack

- **Next.js 15**: For server-rendered React applications
- **React 19**: For building UI components
- **Tailwind CSS**: For styling
- **Firebase**: For authentication and database
- **Vapi**: For AI voice agent integration
- **shadcn/ui**: For pre-built UI components
- **Zod**: For form validation
- **Google Gemini AI**: For generating interview questions

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   bun install
   ```
3. Set up environment variables:
   - Create a `.env.local` file based on the provided example
   - Fill in the values for Firebase, Vapi, and Google Gemini AI

4. Run the development server:
   ```bash
   bun dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

Create a `.env.local` file with the following variables:

```
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Vapi Configuration
NEXT_PUBLIC_VAPI_API_KEY=
NEXT_PUBLIC_VAPI_WORKFLOW_ID=

# Google Gemini AI Configuration
NEXT_PUBLIC_GEMINI_API_KEY=

# Next.js Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Project Structure

```
├── app                  # Next.js app directory
│   ├── (auth)           # Authentication routes
│   └── (root)           # Main application routes
├── components           # React components
│   └── ui               # UI components
├── lib                  # Utility functions and libraries
│   ├── firebase.ts      # Firebase configuration
│   └── gemini.ts        # Google Gemini AI integration
├── public               # Static assets
├── types                # TypeScript type definitions
└── constants            # Application constants
```

## License

MIT
