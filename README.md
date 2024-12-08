# HealthMate - Modern Healthcare Platform

HealthMate is a comprehensive healthcare platform that connects patients with doctors, manages medical records, and provides real-time health monitoring capabilities.

## 🌟 Features

- **User Authentication**: Secure login and registration for patients and doctors
- **Role-Based Access**: Different interfaces and capabilities for patients and doctors
- **Appointment Management**: Schedule, track, and manage medical appointments
- **Medical Records**: Store and manage medical documents securely
- **Health Metrics**: Track vital signs and health metrics over time
- **Chat System**: Built-in communication system between patients and healthcare providers
- **Notifications**: Real-time alerts for appointments, messages, and health updates

## 🛠️ Tech Stack

- **Frontend**:
  - React with TypeScript
  - Vite for build tooling
  - TailwindCSS for styling
  - Zustand for state management
  - React Router for navigation
  - Zod for validation

- **Backend**:
  - NestJS framework
  - PostgreSQL database
  - Prisma ORM
  - JWT authentication
  - GraphQL API (optional)

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn package manager
- Git

## 🚀 Installation

### Windows Setup

1. **Install Prerequisites**:
   ```powershell
   # Install Node.js from https://nodejs.org
   # Install PostgreSQL from https://www.postgresql.org/download/windows
   # Install Git from https://git-scm.com/download/win
   ```

2. **Clone the Repository**:
   ```powershell
   git clone https://github.com/yourusername/healthmate.git
   cd healthmate
   ```

3. **Frontend Setup**:
   ```powershell
   # Install dependencies
   npm install

   # Create and configure frontend .env
   copy .env.example .env
   ```
   Edit `.env` with your configuration:
   ```plaintext
   VITE_API_URL=http://localhost:3000/api
   VITE_OPENAI_API_KEY=your_openai_api_key  # Get from https://platform.openai.com
   ```

4. **Backend Setup**:
   ```powershell
   cd backend/healthmate-api
   npm install

   # Create and configure backend .env
   copy .env.example .env
   ```
   Edit `.env` with your configuration:
   ```plaintext
   # Database
   DATABASE_URL="postgresql://postgres:your_password@localhost:5432/healthmate?schema=public"

   # JWT
   JWT_SECRET="your-super-secret-jwt-key-change-in-production"
   JWT_EXPIRATION="1d"

   # Server
   PORT=3000
   NODE_ENV="development"

   # OpenAI (Optional - for AI features)
   OPENAI_API_KEY="your-openai-api-key"
   ```

5. **Initialize Database**:
   ```powershell
   # Create database
   psql -U postgres
   CREATE DATABASE healthmate;
   \q

   # Run migrations
   npx prisma generate
   npx prisma migrate dev
   ```

### macOS Setup

1. **Install Prerequisites**:
   ```bash
   # Install Homebrew
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

   # Install Node.js and PostgreSQL
   brew install node postgresql@14
   brew services start postgresql@14
   ```

2. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/healthmate.git
   cd healthmate
   ```

3. **Frontend Setup**:
   ```bash
   # Install dependencies
   npm install

   # Create and configure frontend .env
   cp .env.example .env
   ```
   Edit `.env` with your configuration:
   ```plaintext
   VITE_API_URL=http://localhost:3000/api
   VITE_OPENAI_API_KEY=your_openai_api_key  # Get from https://platform.openai.com
   ```

4. **Backend Setup**:
   ```bash
   cd backend/healthmate-api
   npm install

   # Create and configure backend .env
   cp .env.example .env
   ```
   Edit `.env` with your configuration:
   ```plaintext
   # Database
   DATABASE_URL="postgresql://postgres:your_password@localhost:5432/healthmate?schema=public"

   # JWT
   JWT_SECRET="your-super-secret-jwt-key-change-in-production"
   JWT_EXPIRATION="1d"

   # Server
   PORT=3000
   NODE_ENV="development"

   # OpenAI (Optional - for AI features)
   OPENAI_API_KEY="your-openai-api-key"
   ```

5. **Initialize Database**:
   ```bash
   # Create database
   psql postgres
   CREATE DATABASE healthmate;
   \q

   # Run migrations
   npx prisma generate
   npx prisma migrate dev
   ```

## 🏃‍♂️ Running the Application

### Development Mode

1. **Start the Backend**:
   ```bash
   cd backend/healthmate-api
   npm run start:dev
   ```

2. **Start the Frontend** (in a new terminal):
   ```bash
   # From the root directory
   npm run dev
   ```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api
- Database GUI: http://localhost:5555 (after running `npx prisma studio`)

### Production Mode

1. **Build and Start the Backend**:
   ```bash
   cd backend/healthmate-api
   npm run build
   npm run start:prod
   ```

2. **Build and Serve the Frontend**:
   ```bash
   npm run build
   # Use a static file server to serve the dist directory
   ```

## 🔧 Environment Variables

### Frontend (.env)
```plaintext
# Required
VITE_API_URL=http://localhost:3000/api

# Optional - for AI features
VITE_OPENAI_API_KEY=your_openai_api_key
```

### Backend (.env)
```plaintext
# Required
DATABASE_URL="postgresql://user:password@localhost:5432/healthmate?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
PORT=3000
NODE_ENV="development"

# Optional
OPENAI_API_KEY="your-openai-api-key"
```

### Environment Variables Security
1. Never commit `.env` files to version control
2. Keep different .env files for different environments:
   - `.env.development` - Development environment
   - `.env.test` - Testing environment
   - `.env.production` - Production environment
3. Use strong, unique values for secrets
4. Rotate secrets periodically
5. Use environment-specific values for URLs and ports

## 📝 Database Schema

The application uses a PostgreSQL database with the following main entities:
- Users (Patients & Doctors)
- Appointments
- Medical Documents
- Health Metrics
- Chat Messages
- Notifications

Run `npx prisma studio` in the backend directory to view and manage the database through a GUI.

## 🧪 Testing

```bash
# Backend tests
cd backend/healthmate-api
npm run test        # Unit tests
npm run test:e2e    # E2E tests

# Frontend tests
npm run test
```

## 🔒 Security Notes

1. Never commit `.env` files to version control
2. Always use HTTPS in production
3. Keep dependencies updated
4. Follow security best practices for handling medical data
5. Implement proper authentication and authorization

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Ensure the frontend URL is correctly set in the backend CORS configuration
   - Check if the API URL in frontend .env is correct

2. **Database Connection**:
   - Verify PostgreSQL is running
   - Check DATABASE_URL in backend .env
   - Ensure database exists and is accessible

3. **Build Errors**:
   - Clear node_modules and package-lock.json
   - Run npm install again
   - Update Node.js to the latest LTS version

4. **Authentication Issues**:
   - Verify JWT_SECRET is set correctly
   - Check if tokens are being properly stored/cleared
   - Ensure routes are properly protected

For more issues, please check the [Issues](https://github.com/yourusername/healthmate/issues) section.