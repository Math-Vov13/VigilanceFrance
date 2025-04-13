// Environment configuration for the application

// API Gateway base URL
export const API_GATEWAY_URL = 'http://localhost:3000/api/v1';

// Direct microservice URLs (for debugging or if needed)
export const MICROSERVICES = {
  AUTH: 'http://localhost:3001/api/v1',
  MAP: 'http://localhost:3002/api/v1',
  NOTIFICATION: 'http://localhost:3003/api/v1'
};

// API timeout in milliseconds
export const API_TIMEOUT = 15000;

// Environment
export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';