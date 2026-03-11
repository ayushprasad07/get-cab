# GetCab - Ride Booking Application

A modern, fully-featured cab booking application built with Next.js, React, TypeScript, MongoDB, and Tailwind CSS with shadcn components.

## 🚀 Features

### For Users
- **User Authentication**: Registration and login with JWT
- **Book Rides**: Easy booking with pickup and drop-off locations
- **View Bookings**: See all your bookings with status tracking
- **Real-time Updates**: Track ride status (pending, accepted, completed, cancelled)

### For Drivers
- **Driver Authentication**: Dedicated registration and login
- **Dashboard**: View available and active rides
- **Accept Rides**: Browse pending bookings and accept rides
- **Complete Rides**: Mark rides as complete

### General Features
- **Role-based Access**: Different flows for users and drivers
- **Protected Routes**: Secure pages with authentication middleware
- **Responsive Design**: Mobile-friendly UI using Tailwind CSS
- **Modern Components**: Built with shadcn UI components
- **Type Safety**: Full TypeScript support

## 📋 Project Structure

```
src/
├── app/
│   ├── (auth)/                 # Authentication pages
│   │   ├── user-login/
│   │   ├── user-register/
│   │   ├── driver-login/
│   │   └── driver-register/
│   ├── (dashboard)/            # Dashboard pages
│   │   ├── user/
│   │   └── driver/
│   ├── booking/                # Booking page
│   ├── api/                    # API routes
│   │   ├── auth/
│   │   ├── booking/
│   │   └── driver/
│   └── layout.tsx
│
├── components/
│   ├── ui/                     # shadcn components
│   ├── Navbar.tsx
│   └── ProtectedRoute.tsx
│
├── context/                    # React Context
│   ├── AuthContext.tsx
│   └── BookingContext.tsx
│
├── hooks/                      # Custom hooks
│   ├── useAuth.ts
│   └── useBooking.ts
│
├── lib/                        # Utilities
│   ├── db.ts                   # MongoDB connection
│   ├── jwt.ts                  # JWT handling
│   ├── hash.ts                 # Password hashing
│   ├── auth-middleware.ts      # Authentication middleware
│   ├── mailer.ts               # Email service
│   └── utils.ts                # Utilities
│
├── models/                     # Mongoose models
│   ├── User.ts
│   ├── Driver.ts
│   └── Booking.ts
│
├── types/                      # TypeScript types
│   ├── user.ts
│   ├── driver.ts
│   └── booking.ts
│
└── middleware.ts               # Next.js middleware
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+
- MongoDB database
- npm or yarn

### Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd get-cab
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your configuration:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser.

5. **Build for production**
   ```bash
   npm run build
   npm run start
   ```

## 🔐 Authentication Flow

### User Registration/Login
1. User submits registration/login form
2. Password is hashed using bcryptjs
3. JWT token is generated and stored in localStorage
4. User is redirected to dashboard

### Driver Registration/Login
- Same as user, with additional fields for vehicle and license

## 📊 API Endpoints

### User Auth
- `POST /api/auth/user/register` - Register new user
- `POST /api/auth/user/login` - User login

### Driver Auth
- `POST /api/auth/driver/register` - Register new driver
- `POST /api/auth/driver/login` - Driver login

### Bookings
- `POST /api/booking/create` - Create new booking
- `GET /api/booking/list` - Get bookings
- `POST /api/booking/cancel` - Cancel booking

### Driver Actions
- `POST /api/driver/accept` - Accept ride
- `POST /api/driver/complete` - Complete ride

## 🎨 UI Components

Uses shadcn/ui components built with Tailwind CSS:
- Button, Input, Card, Label components
- Fully responsive and accessible
- Customizable with Tailwind

## 💾 Database

Uses MongoDB with Mongoose:
- User model
- Driver model
- Booking model

## 📝 Environment Variables

Create `.env.local` based on `.env.example`:
```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

## 🚀 Deployment

Ready to deploy on Vercel, Railway, or any Node.js hosting platform.
