# Movie Search Platform

This project is a full‑stack web application that lets users search movies stored in a MongoDB Atlas database and perform a variety of queries.  The backend is built with **Node.js**, **Express** and **Mongoose** and connects to the `sample_mflix` dataset on MongoDB Atlas.  The frontend is built with **React** using **Vite** and communicates with the backend API to display movie data and allow basic user interactions.

## Features

* Search for movies by title and view their basic information (title, year, IMDb rating, genres and directors).
* Add new user documents to the database via a simple form.
* Exposes a number of REST endpoints on the backend that can be used to complete the CRUD exercises outlined in the assignment.  These include:
  * Inserting a new user (`POST /api/users`)
  * Finding movies by director, genre, IMDb rating or actors
  * Updating specific movies (e.g. adding an `available_on` field or incrementing the `metacritic` score)
  * Deleting comments or movies under certain conditions
  * Aggregating movies by year or director to compute counts and average ratings

The frontend focuses on movie search and user creation but you can easily extend it to call additional endpoints from the server.

## Prerequisites

1. **Node.js** (version 16 or higher recommended).  Install from [nodejs.org](https://nodejs.org/).
2. **MongoDB Atlas account** with the `sample_mflix` dataset loaded.  Follow the video tutorial linked in your assignment to create a free Atlas cluster and load the sample data.  When the cluster is ready you will need your connection string.  It typically looks like:

   ```
   mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/sample_mflix?retryWrites=true&w=majority
   ```

3. (Optional but recommended) **Git** for version control and pushing to GitHub.

## Project Structure

```
movie-search-platform/
├─ backend/               # Express/Mongoose API
│  ├─ models/             # Mongoose schemas for collections
│  ├─ routes/             # API route definitions
│  ├─ .env.example        # Template for environment variables
│  ├─ package.json        # Node.js dependencies and scripts
│  └─ server.js           # Main entry point for the API
├─ frontend/              # React application
│  ├─ public/
│  │  └─ index.html       # HTML template used by Vite
│  ├─ src/
│  │  ├─ components/      # React components (search bar, movie list, etc.)
│  │  ├─ App.jsx          # Main application component
│  │  └─ main.jsx         # React entry point
│  ├─ package.json        # Front‑end dependencies and scripts
│  ├─ vite.config.js      # Vite configuration (includes proxy for API)
│  └─ README.md           # Front‑end specific notes (optional)
└─ README.md              # You are here
```

## Getting Started Locally

1. **Clone or download this repository**.

   ```bash
   git clone https://github.com/your-username/movie-search-platform.git
   cd movie-search-platform
   ```

2. **Configure the backend**.

   Go into the `backend` directory and copy the example environment file:

   ```bash
   cd backend
   cp .env.example .env
   ```

   Edit the new `.env` file and set `MONGODB_URI` to your Atlas connection string and optionally change the `PORT` (defaults to 5000).  For example:

   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/sample_mflix?retryWrites=true&w=majority
   PORT=5000
   ```

3. **Install backend dependencies** and start the API server.

   ```bash
   npm install
   npm run dev
   ```

   By default the API will run on `http://localhost:5000`.  You should see a message in the terminal indicating that the server has connected to MongoDB successfully.

4. **Configure and run the frontend**.  Open a new terminal window, move to the `frontend` directory and install its dependencies:

   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

   Vite will start a development server (usually at `http://localhost:5173`) and proxy API requests to the backend.  Open the URL printed in the console to use the app.  You can search for movies, add users and view the API responses in your browser’s network panel.

5. **Build for production** (optional).  To create a production build of the frontend, run:

   ```bash
   npm run build
   ```

   This generates a `dist` directory containing static files that can be served by any static hosting provider.  For example, you can copy the contents of `dist` to an Nginx server or deploy it via Netlify/Vercel (see deployment section below).

## Pushing to GitHub

If you wish to publish your code to GitHub, follow these steps inside the `movie-search-platform` directory after setting up the project:

1. Initialize a git repository (if you haven’t already):

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. Create a new repository on GitHub via the web interface.

3. Add the remote and push:

   ```bash
   git remote add origin https://github.com/your-username/your-repo-name.git
   git branch -M main
   git push -u origin main
   ```

Now your project is available on GitHub!  You can connect it to deployment services like Render or Vercel.

## Deployment

### Deploying the Backend (Render)

1. Sign up at [Render](https://render.com/) and click **New → Web Service**.
2. Connect your GitHub account and select your repository.
3. In the **Basic** section set:
   * **Name**: whatever you like (e.g. `movie-search-backend`).
   * **Root Directory**: `backend`
   * **Build Command**: `npm install`
   * **Start Command**: `npm start`
4. Under **Environment** add the `MONGODB_URI` variable and any other environment values from your `.env` file.  Render will provide you with the `PORT` automatically.
5. Click **Create Web Service**.  Render will build and deploy your API.  Once live, note the service URL (e.g. `https://movie-search-backend.onrender.com`).

### Deploying the Frontend (Vercel or Netlify)

1. Choose a static host like [Vercel](https://vercel.com) or [Netlify](https://netlify.com) and create an account.
2. Create a new project from your GitHub repository.  When asked for settings:
   * **Framework Preset**: Vite
   * **Root Directory**: `frontend`
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
3. Add an environment variable `VITE_BACKEND_URL` pointing to your backend’s deployed URL (from Render).  For example:

   ```
   VITE_BACKEND_URL=https://movie-search-backend.onrender.com
   ```

4. Deploy the frontend.  After the build completes you will get a public URL (e.g. `https://movie-search-frontend.vercel.app`) where your movie search app is hosted.  Because Vite’s proxy is only used in development, the `VITE_BACKEND_URL` variable tells the frontend where to send API requests in production.

That’s it!  You now have a working movie search platform with a MongoDB backend.  Feel free to extend the API and UI—for example, to expose the aggregate endpoints, update ratings or delete records—using the provided skeleton.