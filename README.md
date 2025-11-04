# GTW Backend API

RESTful API backend for GTW form management system with JWT authentication and file uploads.

## Features

- 🔐 **JWT Authentication** - Secure admin login with bcrypt password hashing
- 📝 **Multi-Step Forms** - Get Started, Join Team, Agency Partnership forms
- 📤 **File Uploads** - Resume and portfolio uploads via Multer + ImageKit
- 🔄 **Step-by-Step Progress** - Track form completion across multiple steps
- 🛡️ **Role-Based Access** - Admin-only routes with middleware protection
- 🔑 **Password Reset** - OTP-based password recovery

## Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- Bcrypt.js
- Multer (file uploads)
- ImageKit (cloud storage)

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB database

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file:

```env
# Database
MONGO_URI=your_mongodb_connection_string

# JWT Secrets
JWT_SECRET=gtw-secret-key-2024
REFRESH_SECRET=gtw-refresh-secret-2024

# ImageKit Configuration
IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id

# Server
PORT=5000
```

### Development

```bash
npm run dev
```

### Production

```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new admin user
- `POST /api/auth/login` - User login
- `POST /api/auth/admin-login` - Admin login
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/forgot-password` - Request password reset OTP
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/reset-password` - Reset password with OTP
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update profile (protected)
- `PUT /api/auth/change-password` - Change password (protected)
- `GET /api/auth/users` - Get all users (admin only)
- `DELETE /api/auth/users/:id` - Delete user (admin only)

### Get Started Forms
- `POST /api/form` - Create new form
- `GET /api/form` - Get all forms
- `GET /api/form/:id` - Get form by ID
- `PUT /api/form/:id/step1` - Update step 1
- `PUT /api/form/:id/step2` - Update step 2
- `PUT /api/form/:id/step3` - Update step 3
- `PUT /api/form/:id/step4` - Update step 4
- `PUT /api/form/:id/step5` - Update step 5
- `DELETE /api/form/:id` - Delete form

### Join Team Applications
- `POST /api/join-team` - Create new application
- `GET /api/join-team` - Get all applications
- `GET /api/join-team/:id` - Get application by ID
- `PUT /api/join-team/:id/step1` - Update step 1 (personal info)
- `PUT /api/join-team/:id/step2` - Update step 2 (role & skills, resume upload)
- `PUT /api/join-team/:id/step3` - Update step 3
- `PUT /api/join-team/:id/step4` - Update step 4
- `PUT /api/join-team/:id/step5` - Update step 5
- `DELETE /api/join-team/:id` - Delete application

### Agency Partnership
- `POST /api/agency-partnership` - Create new partnership
- `GET /api/agency-partnership` - Get all partnerships
- `GET /api/agency-partnership/:id` - Get partnership by ID
- `PUT /api/agency-partnership/:id/step1` - Update step 1
- `PUT /api/agency-partnership/:id/step2` - Update step 2
- `PUT /api/agency-partnership/:id/step3` - Update step 3 (portfolio upload)
- `PUT /api/agency-partnership/:id/step4` - Update step 4
- `PUT /api/agency-partnership/:id/step5` - Update step 5
- `DELETE /api/agency-partnership/:id` - Delete partnership

## File Upload

Files are uploaded to ImageKit cloud storage:
- **Resumes**: Stored in `/gtw-resumes` folder
- **Portfolios**: Stored in `/gtw-portfolios` folder

### Upload Limits
- Resume: PDF only, 5MB max
- Portfolio: Any file type, 10MB max

## Creating Admin User

Run the helper script:

```bash
node createAdmin.js
```

Or use the API:

```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "username": "admin",
  "email": "admin@gtw.com",
  "password": "admin123",
  "role": "admin"
}
```

## Database Models

### User
- username, email, password (hashed)
- role (admin/user)
- isActive, lastLogin
- resetPasswordOTP, resetPasswordOTPExpires

### GetStartedForm
- name, email, phone, companyName
- projectType, budget, timeline
- currentStep (1-5), isCompleted

### JoinTeam
- name, email, phone
- role, experience, skills
- resumeUrl
- currentStep (1-5), isCompleted

### AgencyPartnership
- agencyName, websiteUrl, location
- teamSize, portfolioUrl
- currentStep (1-5), isCompleted

## Security

- Passwords hashed with bcrypt (12 rounds)
- JWT tokens with expiration
- Admin-only route protection
- File type validation
- CORS enabled

## License

ISC
