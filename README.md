# VedicTravel - Spiritual Travel & Tours Platform

A comprehensive full-stack application for spiritual travel and tours, featuring tour management, booking system, PayU payment integration, user authentication (Google OAuth + Email), and admin panel.

![VedicTravel](https://img.shields.io/badge/VedicTravel-Spiritual%20Tourism-FF6B35)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![NestJS](https://img.shields.io/badge/NestJS-10-E0234E)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-47A248)

## 🌟 Features

### User Features
- ✅ **User Authentication**: Email/Password and Google OAuth sign-in
- ✅ **Tour Browsing**: Browse and filter spiritual tours
- ✅ **Booking System**: Complete booking flow with traveler details
- ✅ **PayU Payment Integration**: Secure payment processing
- ✅ **User Dashboard**: View bookings and manage profile
- ✅ **Responsive Design**: Beautiful UI with VedicTravel brand colors

### Admin Features
- ✅ **Admin Dashboard**: Statistics and analytics
- ✅ **Tour Management**: Create, edit, and delete tours
- ✅ **Booking Management**: View and manage all bookings
- ✅ **User Management**: View all registered users
- ✅ **Revenue Analytics**: Track revenue and bookings

## 🎨 Design

The application uses the **VedicTravel brand colors**:
- **Saffron/Orange** (#FF6B35) - Primary CTA, accents
- **Deep Blue** (#1A2332) - Dark backgrounds, text
- **Sky Blue** (#4A6FA5) - Accents, links
- **Gold** (#D4AF37) - Highlights, decorative elements
- **Cream** (#FFF8F3) - Soft backgrounds

## 🏗️ Tech Stack

### Backend
- **Framework**: NestJS with TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Passport.js (JWT + Google OAuth)
- **Payment**: PayU Payment Gateway
- **API Documentation**: Swagger/OpenAPI

### Frontend
- **Framework**: Next.js 14 (App Router) with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **HTTP Client**: Axios
- **Fonts**: Inter (body), Playfair Display (headings)

## 📁 Project Structure

```
VedicTravel/
├── backend/                 # NestJS Backend
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── users/          # User management
│   │   ├── tours/          # Tours module
│   │   ├── bookings/       # Bookings module
│   │   ├── payments/       # PayU integration
│   │   ├── admin/          # Admin panel APIs
│   │   ├── app.module.ts   # Main app module
│   │   └── main.ts         # Application entry
│   ├── .env                # Environment variables
│   └── package.json
│
└── frontend/               # Next.js Frontend
    ├── app/
    │   ├── page.tsx        # Home page
    │   ├── tours/          # Tours pages
    │   ├── auth/           # Authentication pages
    │   ├── dashboard/      # User dashboard
    │   └── admin/          # Admin panel
    ├── components/
    │   └── layout/         # Header, Footer
    ├── services/           # API services
    ├── lib/                # Utilities
    ├── .env.local          # Environment variables
    └── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or Atlas)
- Google OAuth credentials
- PayU merchant credentials

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   - Copy `.env.example` to `.env`
   - Update the following variables:
     ```env
     MONGODB_URI=mongodb://localhost:27017/vedictravel
     JWT_SECRET=your-secret-key
     GOOGLE_CLIENT_ID=your-google-client-id
     GOOGLE_CLIENT_SECRET=your-google-client-secret
     PAYU_MERCHANT_KEY=your-payu-key
     PAYU_MERCHANT_SALT=your-payu-salt
     ```

4. **Start MongoDB** (if running locally):
   ```bash
   mongod
   ```

5. **Run the backend**:
   ```bash
   npm run start:dev
   ```

   Backend will run on `http://localhost:5000`
   API Documentation: `http://localhost:5000/api/docs`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   - Copy `.env.local.example` to `.env.local`
   - Update variables if needed (defaults should work for local development)

4. **Run the frontend**:
   ```bash
   npm run dev
   ```

   Frontend will run on `http://localhost:3000`

## 📝 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register with email
- `POST /api/v1/auth/login` - Login with email
- `GET /api/v1/auth/google` - Google OAuth login
- `GET /api/v1/auth/me` - Get current user

### Tours
- `GET /api/v1/tours` - Get all tours (with filters)
- `GET /api/v1/tours/:id` - Get tour by ID
- `POST /api/v1/tours` - Create tour (Admin only)
- `PUT /api/v1/tours/:id` - Update tour (Admin only)
- `DELETE /api/v1/tours/:id` - Delete tour (Admin only)

### Bookings
- `POST /api/v1/bookings` - Create booking
- `GET /api/v1/bookings` - Get user bookings
- `GET /api/v1/bookings/:id` - Get booking details
- `PUT /api/v1/bookings/:id/cancel` - Cancel booking

### Payments
- `POST /api/v1/payments/initiate` - Initiate PayU payment
- `POST /api/v1/payments/verify` - Verify payment

### Admin
- `GET /api/v1/admin/dashboard` - Dashboard stats
- `GET /api/v1/admin/bookings` - All bookings
- `GET /api/v1/admin/users` - All users
- `PUT /api/v1/admin/bookings/:id/status` - Update booking status

## 🔐 Default Admin Credentials

To create an admin user, you can either:
1. Manually update a user's role in MongoDB to `admin`
2. Use the seed script (if created)

## 🎯 Key Features Implementation

### PayU Payment Integration
- Hash generation for secure transactions
- Payment initiation with booking details
- Payment verification and callback handling
- Transaction status tracking

### Google OAuth
- Seamless Google Sign-In
- Account linking for existing users
- Automatic user creation

### Admin Panel
- Dashboard with statistics
- Tour CRUD operations
- Booking management
- Revenue analytics

## 🛠️ Development

### Backend Development
```bash
cd backend
npm run start:dev  # Watch mode
npm run build      # Production build
npm run test       # Run tests
```

### Frontend Development
```bash
cd frontend
npm run dev        # Development server
npm run build      # Production build
npm run start      # Production server
```

## 📦 Deployment

### Backend Deployment
1. Set environment variables on your hosting platform
2. Build the application: `npm run build`
3. Start the server: `npm run start:prod`

### Frontend Deployment
1. Set environment variables
2. Build the application: `npm run build`
3. Deploy to Vercel, Netlify, or any Node.js hosting

## 🤝 Contributing

This is a private project for VedicTravel. For any issues or suggestions, please contact the development team.

## 📄 License

Copyright © 2026 VedicTravel. All rights reserved.

## 📞 Support

For support, email tours@vedictravel.com or call +91-8588910062.

---

**Built with ❤️ for spiritual travelers across Ancient Bharat**
