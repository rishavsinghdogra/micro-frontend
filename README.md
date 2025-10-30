# Micro-Frontend Project
NOTE: Only the backend repo needs a .env setup so you can create one by copying the .env.example file.

## Project Overview

This project is a micro-frontend architecture application consisting of a backend server and three frontend modules: email, chat-room, and host-app. The backend handles API requests, database interactions, authentication, and real-time communication. The host-app integrates the email and chat-room microfrontends using Module Federation. The application allows users to manage emails and participate in real-time chat rooms, with a shared backend for data persistence and security.

The project structure is as follows:
- **backend/**: Node.js server with Express and Prisma for API and database management.
- **email/**: React microfrontend for email functionality.
- **chat-room/**: React microfrontend for real-time chat.
- **host-app/**: React host application that federates and integrates the microfrontends.

## Prerequisites

- Node.js (version 14 or higher) <mcreference link="https://dev.to/ajor-saha/setting-up-a-backend-with-prisma-express-and-postgresql-482e" index="5">5</mcreference>
- npm or yarn for package management.
- PostgreSQL database (configured via Prisma). <mcreference link="https://dev.to/ajor-saha/setting-up-a-backend-with-prisma-express-and-postgresql-482e" index="5">5</mcreference>
- Environment variables setup (e.g., .env file for backend).

## Setup Instructions

### General Setup
1. Clone the repository.
2. Navigate to the project root: `cd micro-frontend`.
3. Install dependencies in each sub-folder as detailed below.

### Backend Setup
- Directory: `backend/`
- Install dependencies: `npm install`
- Setup environment variables in `.env` (e.g., DATABASE_URL, JWT_SECRET).
- Generate Prisma client: `npx prisma generate`
- Migrate database: `npm run db:migrate` or `npx prisma migrate dev` <mcreference link="https://dev.to/ajor-saha/setting-up-a-backend-with-prisma-express-and-postgresql-482e" index="5">5</mcreference> <mcreference link="https://medium.com/@prihartonomuhamad/building-full-rest-api-with-express-js-prisma-mysql-postman-for-testing-api-1-3-6069135c5d28" index="4">4</mcreference>
- Key files:
  - `package.json`: Defines scripts like `dev`, `start`, `db:generate`, `db:migrate`.
  - `schema.prisma`: Defines database models (User, Message, ChatRoom) using PostgreSQL. <mcreference link="https://webdock.io/en/docs/how-guides/javascript-guides/nodejs-boilerplate-typescript-express-prisma" index="1">1</mcreference>
  - `server.js`: Sets up HTTP server and Socket.IO for real-time features.
  - `app.js`: Configures Express app with middleware and routes for auth, messages, room, email.

### Email Microfrontend Setup
- Directory: `email/`
- Install dependencies: `npm install`
- Key files:
  - `package.json`: Scripts for `dev`, `build`, `lint`, `preview`.
  - `Emails.tsx`: Main React component for listing, viewing, and composing emails using React Query and Axios.
  - `vite.config.ts`: Vite configuration with React plugin, Tailwind CSS, and Module Federation for exposure as `email_app`.
  - TypeScript configs: `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`.

### Chat-Room Microfrontend Setup
- Directory: `chat-room/`
- Install dependencies: `npm install`
- Key files:
  - `package.json`: Scripts for `dev`, `build`, `lint`, `preview`.
  - `ChatApp.tsx`: Main React component for chat functionality with Socket.IO client for real-time messaging.
  - `vite.config.ts`: Vite configuration with React plugin, Tailwind CSS, and Module Federation for exposure as `chat_app`.
  - TypeScript configs: `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`.

### Host-App Setup
- Directory: `host-app/`
- Install dependencies: `npm install`
- Key files:
  - `package.json`: Scripts for `dev`, `build`, `lint`, `preview`.
  - `App.tsx`: Integrates remote microfrontends (chat_app and email_app) using lazy loading and React Router.
  - `vite.config.ts`: Vite configuration with React plugin, Tailwind CSS, and Module Federation to consume remotes from localhost ports.
  - TypeScript configs: `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`.

## Running the Project

1. Start the backend: In `backend/`, run `npm run dev` (uses Nodemon for development). The server runs on port 5000 with Socket.IO. <mcreference link="https://dev.to/kjdowns/building-a-basic-api-using-express-node-and-mongodb-160f" index="2">2</mcreference>
2. Start the email microfrontend: In `email/`, run `npm run dev` (Vite server on port 5175).
3. Start the chat-room microfrontend: In `chat-room/`, run `npm run dev` (Vite server on port 5174).
4. Start the host-app: In `host-app/`, run `npm run dev` (Vite server on port 5173). Access the app at `http://localhost:5173`.
5. The host-app will load the email and chat-room modules dynamically.

For production:
- Build each frontend: `npm run build`
- Start backend: `npm start`

## Package Explanations

### Backend Packages
- **@prisma/client**: Prisma ORM client for database interactions, querying, and mutations. <mcreference link="https://webdock.io/en/docs/how-guides/javascript-guides/nodejs-boilerplate-typescript-express-prisma" index="1">1</mcreference> <mcreference link="https://dev.to/ajor-saha/setting-up-a-backend-with-prisma-express-and-postgresql-482e" index="5">5</mcreference>
- **bcryptjs**: For hashing passwords securely. <mcreference link="https://medium.com/@prihartonomuhamad/building-full-rest-api-with-express-js-prisma-mysql-postman-for-testing-api-1-3-6069135c5d28" index="4">4</mcreference> <mcreference link="https://dev.to/ajor-saha/setting-up-a-backend-with-prisma-express-and-postgresql-482e" index="5">5</mcreference>
- **cors**: Enables Cross-Origin Resource Sharing for frontend-backend communication. <mcreference link="https://webdock.io/en/docs/how-guides/javascript-guides/nodejs-boilerplate-typescript-express-prisma" index="1">1</mcreference> <mcreference link="https://dev.to/kjdowns/building-a-basic-api-using-express-node-and-mongodb-160f" index="2">2</mcreference>
- **dotenv**: Loads environment variables from .env file. <mcreference link="https://webdock.io/en/docs/how-guides/javascript-guides/nodejs-boilerplate-typescript-express-prisma" index="1">1</mcreference> <mcreference link="https://dev.to/kjdowns/building-a-basic-api-using-express-node-and-mongodb-160f" index="2">2</mcreference>
- **express**: Web framework for building APIs and handling routes. <mcreference link="https://webdock.io/en/docs/how-guides/javascript-guides/nodejs-boilerplate-typescript-express-prisma" index="1">1</mcreference> <mcreference link="https://medium.com/@narcis.fanica/building-a-rest-api-with-node-js-prisma-and-typescript-part-1-introduction-and-project-setup-217c7cceb6aa" index="3">3</mcreference>
- **express-rate-limit**: Limits request rates to prevent abuse. <mcreference link="https://medium.com/@prihartonomuhamad/building-full-rest-api-with-express-js-prisma-mysql-postman-for-testing-api-1-3-6069135c5d28" index="4">4</mcreference>
- **helmet**: Sets security HTTP headers. <mcreference link="https://webdock.io/en/docs/how-guides/javascript-guides/nodejs-boilerplate-typescript-express-prisma" index="1">1</mcreference> <mcreference link="https://medium.com/@prihartonomuhamad/building-full-rest-api-with-express-js-prisma-mysql-postman-for-testing-api-1-3-6069135c5d28" index="4">4</mcreference>
- **jsonwebtoken**: Generates and verifies JWT for authentication. <mcreference link="https://webdock.io/en/docs/how-guides/javascript-guides/nodejs-boilerplate-typescript-express-prisma" index="1">1</mcreference> <mcreference link="https://dev.to/ajor-saha/setting-up-a-backend-with-prisma-express-and-postgresql-482e" index="5">5</mcreference>
- **morgan**: HTTP request logger. <mcreference link="https://webdock.io/en/docs/how-guides/javascript-guides/nodejs-boilerplate-typescript-express-prisma" index="1">1</mcreference>
- **nodemailer**: Sends emails from Node.js. <mcreference link="https://dev.to/kjdowns/building-a-basic-api-using-express-node-and-mongodb-160f" index="2">2</mcreference>
- **socket.io**: Enables real-time bidirectional communication. <mcreference link="https://webdock.io/en/docs/how-guides/javascript-guides/nodejs-boilerplate-typescript-express-prisma" index="1">1</mcreference>
- **prisma**: ORM for database schema and migrations. <mcreference link="https://webdock.io/en/docs/how-guides/javascript-guides/nodejs-boilerplate-typescript-express-prisma" index="1">1</mcreference> <mcreference link="https://medium.com/@narcis.fanica/building-a-rest-api-with-node-js-prisma-and-typescript-part-1-introduction-and-project-setup-217c7cceb6aa" index="3">3</mcreference>
- **ts-node**: Executes TypeScript directly. <mcreference link="https://webdock.io/en/docs/how-guides/javascript-guides/nodejs-boilerplate-typescript-express-prisma" index="1">1</mcreference> <mcreference link="https://medium.com/@narcis.fanica/building-a-rest-api-with-node-js-prisma-and-typescript-part-1-introduction-and-project-setup-217c7cceb6aa" index="3">3</mcreference>
- **nodemon**: Monitors for changes and restarts the server. <mcreference link="https://webdock.io/en/docs/how-guides/javascript-guides/nodejs-boilerplate-typescript-express-prisma" index="1">1</mcreference> <mcreference link="https://dev.to/kjdowns/building-a-basic-api-using-express-node-and-mongodb-160f" index="2">2</mcreference>

### Frontend Packages (Shared across email, chat-room, host-app)
- **react**: Core library for building UIs. <mcreference link="https://macaronics.net/m04/react/view/2365" index="1">1</mcreference> <mcreference link="https://medium.com/@hamzamurtaza/a-comprehensive-guide-to-building-using-react-shadcn-react-hook-form-tailwind-css-and-zustand-62e422f537f8" index="2">2</mcreference> <mcreference link="https://www.material-tailwind.com" index="4">4</mcreference>
- **react-dom**: Provides DOM-specific methods for React. <mcreference link="https://macaronics.net/m04/react/view/2365" index="1">1</mcreference> <mcreference link="https://medium.com/@hamzamurtaza/a-comprehensive-guide-to-building-using-react-shadcn-react-hook-form-tailwind-css-and-zustand-62e422f537f8" index="2">2</mcreference>
- **@tanstack/react-query**: Manages server state, caching, and data fetching. <mcreference link="https://macaronics.net/m04/react/view/2365" index="1">1</mcreference> <mcreference link="https://medium.com/@hamzamurtaza/a-comprehensive-guide-to-building-using-react-shadcn-react-hook-form-tailwind-css-and-zustand-62e422f537f8" index="2">2</mcreference> <mcreference link="https://devdreaming.com/blogs/top-10-npm-packages-for-react-developers" index="5">5</mcreference>
- **class-variance-authority**: Utility for managing Tailwind variants. <mcreference link="https://macaronics.net/m04/react/view/2365" index="1">1</mcreference> <mcreference link="https://medium.com/@hamzamurtaza/a-comprehensive-guide-to-building-using-react-shadcn-react-hook-form-tailwind-css-and-zustand-62e422f537f8" index="2">2</mcreference>
- **clsx**: Conditionally combines class names. <mcreference link="https://macaronics.net/m04/react/view/2365" index="1">1</mcreference> <mcreference link="https://medium.com/@hamzamurtaza/a-comprehensive-guide-to-building-using-react-shadcn-react-hook-form-tailwind-css-and-zustand-62e422f537f8" index="2">2</mcreference> <mcreference link="https://massivepixel.io/blog/react-packages/" index="3">3</mcreference>
- **lucide-react**: Icon library for React. <mcreference link="https://macaronics.net/m04/react/view/2365" index="1">1</mcreference> <mcreference link="https://medium.com/@hamzamurtaza/a-comprehensive-guide-to-building-using-react-shadcn-react-hook-form-tailwind-css-and-zustand-62e422f537f8" index="2">2</mcreference>
- **tailwind-merge**: Merges Tailwind classes without conflicts. <mcreference link="https://macaronics.net/m04/react/view/2365" index="1">1</mcreference> <mcreference link="https://medium.com/@hamzamurtaza/a-comprehensive-guide-to-building-using-react-shadcn-react-hook-form-tailwind-css-and-zustand-62e422f537f8" index="2">2</mcreference>
- **tailwindcss-animate**: Adds animation utilities to Tailwind. <mcreference link="https://macaronics.net/m04/react/view/2365" index="1">1</mcreference>
- **@radix-ui/react-*** (dialog, label, select, slot, tooltip, avatar, separator)**: Primitive UI components for building accessible interfaces. <mcreference link="https://macaronics.net/m04/react/view/2365" index="1">1</mcreference> <mcreference link="https://medium.com/@hamzamurtaza/a-comprehensive-guide-to-building-using-react-shadcn-react-hook-form-tailwind-css-and-zustand-62e422f537f8" index="2">2</mcreference>
- **axios**: Promise-based HTTP client for API requests. <mcreference link="https://macaronics.net/m04/react/view/2365" index="1">1</mcreference> <mcreference link="https://medium.com/@hamzamurtaza/a-comprehensive-guide-to-building-using-react-shadcn-react-hook-form-tailwind-css-and-zustand-62e422f537f8" index="2">2</mcreference> <mcreference link="https://massivepixel.io/blog/react-packages/" index="3">3</mcreference>
- **react-hook-form**: Manages form state and validation. <mcreference link="https://macaronics.net/m04/react/view/2365" index="1">1</mcreference> <mcreference link="https://medium.com/@hamzamurtaza/a-comprehensive-guide-to-building-using-react-shadcn-react-hook-form-tailwind-css-and-zustand-62e422f537f8" index="2">2</mcreference> <mcreference link="https://devdreaming.com/blogs/top-10-npm-packages-for-react-developers" index="5">5</mcreference>
- **zod**: Schema validation and type inference. <mcreference link="https://macaronics.net/m04/react/view/2365" index="1">1</mcreference> <mcreference link="https://medium.com/@hamzamurtaza/a-comprehensive-guide-to-building-using-react-shadcn-react-hook-form-tailwind-css-and-zustand-62e422f537f8" index="2">2</mcreference> <mcreference link="https://devdreaming.com/blogs/top-10-npm-packages-for-react-developers" index="5">5</mcreference>
- **socket.io-client**: Client-side library for Socket.IO real-time features. <mcreference link="https://macaronics.net/m04/react/view/2365" index="1">1</mcreference>
- **react-router-dom**: Client-side routing for React. <mcreference link="https://medium.com/@hamzamurtaza/a-comprehensive-guide-to-building-using-react-shadcn-react-hook-form-tailwind-css-and-zustand-62e422f537f8" index="2">2</mcreference>
- **@tailwindcss/vite**: Tailwind CSS plugin for Vite. <mcreference link="https://dev.to/manojspace/creating-a-modern-react-app-a-comprehensive-guide-1plk" index="1">1</mcreference>
- **tw-animate-css**: Animation utilities for Tailwind. <mcreference link="https://macaronics.net/m04/react/view/2365" index="1">1</mcreference>

### Development Tools (Shared)
- **typescript**: Adds static typing to JavaScript. <mcreference link="https://dev.to/manojspace/creating-a-modern-react-app-a-comprehensive-guide-1plk" index="1">1</mcreference> <mcreference link="https://medium.com/@robinviktorsson/complete-guide-to-setting-up-react-with-typescript-and-vite-2025-468f6556aaf2" index="2">2</mcreference> <mcreference link="https://vite.dev/guide/features" index="3">3</mcreference>
- **eslint**: Lints JavaScript/TypeScript code. <mcreference link="https://dev.to/manojspace/creating-a-modern-react-app-a-comprehensive-guide-1plk" index="1">1</mcreference> <mcreference link="https://medium.com/@robinviktorsson/complete-guide-to-setting-up-react-with-typescript-and-vite-2025-468f6556aaf2" index="2">2</mcreference> <mcreference link="https://vite.dev/guide/features" index="3">3</mcreference> <mcreference link="https://victorlillo.dev/blog/react-typescript-vite-component-library" index="5">5</mcreference>
- **@types/node, @types/react, @types/react-dom**: Type definitions for Node.js and React. <mcreference link="https://dev.to/manojspace/creating-a-modern-react-app-a-comprehensive-guide-1plk" index="1">1</mcreference>
- **@vitejs/plugin-react**: Vite plugin for React support. <mcreference link="https://vite.dev/guide/features" index="3">3</mcreference> <mcreference link="https://dev.to/pappijx/effortlessly-setting-up-your-react-project-with-vite-husky-typescript-and-eslint-a-comprehensive-guide-n5l" index="4">4</mcreference>
- **@originjs/vite-plugin-federation**: Enables Module Federation in Vite for microfrontends.
- **autoprefixer**: Adds vendor prefixes to CSS. <mcreference link="https://dev.to/manojspace/creating-a-modern-react-app-a-comprehensive-guide-1plk" index="1">1</mcreference> <mcreference link="https://victorlillo.dev/blog/react-typescript-vite-component-library" index="5">5</mcreference>
- **postcss**: Processes CSS with plugins like Autoprefixer. <mcreference link="https://dev.to/manojspace/creating-a-modern-react-app-a-comprehensive-guide-1plk" index="1">1</mcreference> <mcreference link="https://vite.dev/guide/features" index="3">3</mcreference> <mcreference link="https://victorlillo.dev/blog/react-typescript-vite-component-library" index="5">5</mcreference>
- **tailwindcss**: Utility-first CSS framework. <mcreference link="https://dev.to/manojspace/creating-a-modern-react-app-a-comprehensive-guide-1plk" index="1">1</mcreference> <mcreference link="https://medium.com/@hamzamurtaza/a-comprehensive-guide-to-building-using-react-shadcn-react-hook-form-tailwind-css-and-zustand-62e422f537f8" index="2">2</mcreference> <mcreference link="https://massivepixel.io/blog/react-packages/" index="3">3</mcreference> <mcreference link="https://www.material-tailwind.com" index="4">4</mcreference>
- **globals**: Provides global variable definitions for ESLint. <mcreference link="https://dev.to/manojspace/creating-a-modern-react-app-a-comprehensive-guide-1plk" index="1">1</mcreference>
- **typescript-eslint**: ESLint plugins for TypeScript. <mcreference link="https://dev.to/manojspace/creating-a-modern-react-app-a-comprehensive-guide-1plk" index="1">1</mcreference> <mcreference link="https://dev.to/pappijx/effortlessly-setting-up-your-react-project-with-vite-husky-typescript-and-eslint-a-comprehensive-guide-n5l" index="4">4</mcreference>
- **vite**: Build tool and dev server for modern web projects. <mcreference link="https://medium.com/@robinviktorsson/complete-guide-to-setting-up-react-with-typescript-and-vite-2025-468f6556aaf2" index="2">2</mcreference> <mcreference link="https://vite.dev/guide/features" index="3">3</mcreference> <mcreference link="https://dev.to/pappijx/effortlessly-setting-up-your-react-project-with-vite-husky-typescript-and-eslint-a-comprehensive-guide-n5l" index="4">4</mcreference> <mcreference link="https://victorlillo.dev/blog/react-typescript-vite-component-library" index="5">5</mcreference>

## Additional Notes
- Ensure all ports (5000 for backend, 5173-5175 for frontends) are available.
- For development, use the `dev` scripts which enable hot module replacement via Vite.
- The project uses Module Federation for microfrontend integration, allowing independent deployment. <mcreference link="https://vite.dev/guide/features" index="3">3</mcreference>
- Linting: Run `npm run lint` in each frontend folder to check code style with ESLint. <mcreference link="https://dev.to/manojspace/creating-a-modern-react-app-a-comprehensive-guide-1plk" index="1">1</mcreference>

This README covers all aspects of the project. For issues, check console logs or database connections.