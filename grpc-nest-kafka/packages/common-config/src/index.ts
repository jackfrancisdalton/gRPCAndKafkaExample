// NOTE: you'd normally store these in a .env file in the project root and fetch them via .dotenv, but for simplicity sake I'm using static strings here

// gRPC URLS
export const DATE_SERVICE_GRPC_URL = '0.0.0.0:50051';
export const WEATHER_SERVICE_GRPC_URL = '0.0.0.0:50053';
export const QUOTE_SERVICE_GRPC_URL = '0.0.0.0:50052';

// HTTP ports
export const BFF_PORT = '3001';
