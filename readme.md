# REST API Basic

A simple Node.js REST API built with Express and MongoDB for a basic social/media-style backend. It supports user signup/login, user status management, post creation, post listing, post updates, post deletion, and image uploads.

## Features

- User registration and login
- JWT-based authentication
- User status fetch/update
- Create, read, update, and delete posts
- Image upload support for PNG, JPG, and JPEG files
- Static serving of uploaded images
- MongoDB integration via Mongoose

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (JSON Web Tokens)
- bcrypt for password hashing
- Multer for file uploads

## Project Structure

```bash
rest-api-basic/
├── app.js
├── controller/
├── middleware/
├── models/
├── routes/
├── utils/
├── images/
├── .env
├── package.json
└── readme.md
```

## Prerequisites

- Node.js installed
- MongoDB database access (MongoDB Atlas or local MongoDB)
- npm package manager

## Installation

1. Clone the project and navigate to the project root.
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the project root and add your MongoDB credentials:

```env
MONGO_USERNAME=your_mongodb_username
MONGO_PASSWORD=your_mongodb_password
DEFAULT_DATABASE=your_database_name
```

4. Start the server:

```bash
npm start
```

For development mode with automatic restarts:

```bash
npm run start:dev
```

The application will run on:

```bash
http://localhost:8080
```

## API Endpoints

### Authentication

- `POST /signup`
  - Registers a new user
- `POST /login`
  - Logs in a user and returns a JWT token

### User Status

- `GET /status` (Protected)
  - Fetches the current user status
- `PUT /status` (Protected)
  - Updates the current user status

### Posts

- `GET /posts` (Protected)
  - Fetches posts with pagination
- `GET /post/:postId` (Protected)
  - Fetches a single post by ID
- `POST /post` (Protected)
  - Creates a new post with an uploaded image
- `PUT /post/:postId` (Protected)
  - Updates a post and optionally its image
- `DELETE /post/:postId` (Protected)
  - Deletes a post

### Image Upload

Uploaded images are stored in the `images/` folder and exposed at:

```bash
/images/<filename>
```

Accepted formats:

- PNG
- JPG
- JPEG

## Authentication

Protected routes require a valid JWT token in the `Authorization` header:

```http
Authorization: Bearer <token>
```

## Notes

- The app uses `multer` to handle image uploads.
- The MongoDB connection is configured in `utils/database.js`.
- Error handling is centralized in `app.js`.

## License

This project is licensed under the MIT License.
