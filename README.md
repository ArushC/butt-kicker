# Butt Kicker

The deployment for this application can be viewed here: [https://butt-kicker.vercel.app/](https://butt-kicker.vercel.app/). Note that the backend server on Render periodically purges data after long periods of inactivity. Due to server spindown, logging in for the first time may also take a while. 

## Description

A high-fidelity prototype of an application to help users quit smoking, brought to you by the Builder Bros (Arush, Ad, and Andy).

## Important Note Regarding Browser Compatibility

~~If you're unable to log in despite entering valid credentials, your browser may be blocking third-party cookies which are necessary for authentication. This issue occurs because the backend is deployed on Render while the frontend is hosted on Vercel, resulting in different domain names. To resolve this, you can enable cross-site tracking in your browser settings, or use a different browser that allows third-party cookies.~~

Secure client-side authentication has been **temporarily disabled** to ensure that the production app can be accessed by anyone, regardless of what browser they are using. To reenable authentication, uncomment line 25 in frontend/src/useAuth.js. For the best experience, we recommend using Chrome. The voice input features may not be fully supported on browsers like Safari and Firefox.

## Prerequisites for Local Setup

- Node.js
- npm

## Installation

Follow these steps to set up the project on your local machine:

1. **Clone the repository:**

    ```sh
    git clone https://github.com/ArushC/butt-kicker.git butt-kicker
    cd butt-kicker
    ```

2. **Install dependencies:**

    Run `npm install` in the following directories:

    - **Root Directory:**

        ```sh
        npm install
        ```

    - **Frontend Directory:**

        ```sh
        cd frontend
        npm install
        cd ..
        ```

    - **Backend Directory:**

        ```sh
        cd backend
        npm install
        cd ..
        ```

## Database Setup

3. **Run migrations and seed data:**

    ```sh
    cd backend
    npx knex migrate:latest
    npx knex seed:run
    cd ..
    ```

## Running the Application

4. **Start the local server:**

    From the root directory, run:

    ```sh
    npm start
    ```

