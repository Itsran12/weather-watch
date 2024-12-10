# 🌦️ Weather-Watch

Weather-Watch is a weather application designed to provide accurate and real-time weather data. Built with modern web technologies, it offers a seamless experience and ensures maintainability and performance with clean, optimized code.

## 📋 Features

- **Real-Time Weather Data**: Fetches weather information using OpenWeatherMap API (or similar).
- **User Authentication**: Secured with JSON Web Tokens (JWT).
- **Efficient Data Handling**: Optimized backend to prevent N+1 query issues.
- **Responsive Design**: Built with Tailwind CSS for a mobile-first responsive experience.
- **Interactive UI**: Smooth animations for an engaging user experience.
- **Clean Code**: Organized and maintainable backend and frontend architecture.

## 🛠️ Tech Stack

### Backend
- **Node.js + Express.js**: Backend framework.
- **JSON Web Token (JWT)**: For user authentication and secure sessions.
- **CORS**: To manage cross-origin resource sharing.
- **Axios**: For making HTTP requests to fetch weather data from an open API.
- **Prisma**: ORM for database management.
- **MySQL**: Relational database to store user data and preferences.

### Frontend
- **React.js + Vite**: Lightning-fast development environment.
- **Tailwind CSS**: For crafting modern, responsive, and elegant designs.

## 📦 Installation

### Prerequisites
Ensure you have the following installed:
- Node.js (v16 or later)
- npm or yarn
- MySQL

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/weather-watch.git
   cd weather-watch
   ```

2. Set up the backend:
   ```bash
   # Navigate to the backend directory
   cd backend
   
   # Install dependencies
   npm install
   
   # Set environment variables in a .env file
   # Add the following to .env:
   # DATABASE_URL="mysql://user:password@localhost:3306/weather_watch"
   # JWT_SECRET="your_secret_key"
   # API_KEY="your_open_weather_api_key"
   
   # Run the backend
   npm run start
   ```

3. Set up the frontend:
   ```bash
   # Navigate to the frontend directory
   cd frontend
   
   # Install dependencies
   npm install
   
   # Start the development server
   npm run dev
   ```

4. Access the application:
   - Open your browser and go to http://localhost:5173

## 📂 Project Structure

```
weather-watch/
├── backend/                  # Folder for the backend
│   ├── prisma/               # Prisma schema and migrations
│   ├── src/                  # Source code for the backend
│   │   ├── controllers/      # Handles business logic for API endpoints
│   │   ├── middlewares/      # Custom middleware (e.g., authentication, error handling)
│   │   ├── routes/           # API route definitions
│   │   ├── services/         # Service layer for core business logic
│   │   ├── utils/            # Utility functions and helpers
│   │   └── app.js            # Main entry point for the backend
│   ├── .env                  # Environment configuration file
│   ├── package.json          # NPM configuration for backend dependencies
├── frontend/                 # Folder for the frontend
│   ├── public/               # Static assets (favicon, images, etc.)
│   ├── src/                  # Source code for the frontend
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Application pages
│   │   ├── hooks/            # Custom React hooks
│   │   ├── styles/           # Global styles or Tailwind CSS configurations
│   │   └── App.jsx           # Main application entry for React
│   ├── index.html            # Main HTML file for React
│   ├── package.json          # NPM configuration for frontend dependencies
│   ├── postcss.config.js     # PostCSS configuration
│   ├── tailwind.config.js    # Tailwind CSS configuration
│   └── vite.config.js        # Vite configuration for frontend
├── .gitignore                # Specifies files/folders to ignore in Git
└── README.md                 # Documentation for the project
```

## 🔧 Optimization Techniques

- **N+1 Query Problem**: Avoided using Prisma's optimized query patterns.
- **Code Modularity**: Clean separation of concerns for better maintainability.
- **Reusable Components**: Frontend built with modular and reusable React components.

## 🖥️ Usage

1. Register an account and log in.
2. Search for a city to get its real-time weather data.
3. View your saved preferences or weather history.

## 🤝 Contribution

Contributions are welcome! Feel free to submit a pull request or open an issue for suggestions and improvements.

## 📜 License

This project is licensed under the MIT License.
