# 🚀 Gooter-Goo — Real-time Chat & Video Calling App

**Gooter-Goo** is a full-stack, feature-rich real-time communication platform built with Next.js, featuring instantaneous text messaging, group chat creations, and high-fidelity video calling. 

---

## ✨ Features

- **🔒 Secure Authentication**: Powered by Clerk for seamless and secure user onboarding and authentication.
- **💬 Real-time Text Messaging**: High-performance chat functionality powered by Stream Chat SDK.
- **👥 Group Chat Management**: Easily search for users, select multiple members, and create named group conversations.
- **📹 Seamless Video Calls**: In-app face-to-face video calling experience built with Stream Video SDK.
- **⚡ Reactive Backend**: Instant user and chat synchronization handled globally by Convex.
- **🎨 Modern UI/UX**: Designed using Tailwind CSS and Base UI components for a fully responsive, smooth, and accessible interface.

---

## 🛠️ Tech Stack

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS, Base UI, Lucide Icons
- **Authentication**: Clerk Auth
- **Real-time Chat & Video**: Stream SDK (`stream-chat-react` & `@stream-io/video-react-sdk`)
- **Database & Backend Logic**: Convex

---

## 🚀 Getting Started

Follow these steps to set up the project locally:

### 1. Clone the Repository
```bash
git clone [https://github.com/YOUR_GITHUB_USERNAME/gooter-goo.git](https://github.com/YOUR_GITHUB_USERNAME/gooter-goo.git)
cd gooter-goo
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a .env.local file in the root directory and add your keys:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_pub_key
CLERK_SECRET_KEY=your_clerk_secret_key

NEXT_PUBLIC_CONVEX_URL=your_convex_deployment_url

NEXT_PUBLIC_STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret
```

### 4. Run the Development Server
First, start the Convex backend runner in a separate terminal:

```bash
npx convex dev
Then, run the Next.js development server:
```

```bash
npm run dev
```

Open http://localhost:3000 in your browser to see the application in action!