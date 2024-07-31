# Butt Kicker

## Description

A high-fidelity prototype of an application to help users quit smoking.

## Prerequisites

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

