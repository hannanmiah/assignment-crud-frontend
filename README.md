# Attendance Management System

An intuitive and powerful attendance management system built with Nuxt.js and Nuxt UI.

## Features

*   **Dashboard:** A comprehensive overview of attendance statistics.
*   **Student Management:** Add, view, and manage students.
*   **Customer Management:** Manage customer information.
*   **Attendance Tracking:** Easily mark and track attendance.
*   **Notifications:** In-app notifications for important events.
*   **Settings:** Configure application settings, manage members, and set notification preferences.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   [Node.js](https://nodejs.org/) (v18 or newer)
*   [pnpm](https://pnpm.io/)

### Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/hannanmiah/attendance-management-frontend.git
    cd attendance-management-frontend
    ```

2.  Install the dependencies:

    ```bash
    pnpm install
    ```

### Configuration

1.  Create a `.env` file by copying the example file:

    ```bash
    cp .env.example .env
    ```

2.  Update the `.env` file with your environment variables:

    ```env
    NUXT_PUBLIC_API_BASE=http://localhost:8000
    GEMINI_API_KEY=your_gemini_api_key
    ```

### Running the Application

*   **Development:**

    ```bash
    pnpm dev
    ```

    The application will be available at `http://localhost:3000`.

*   **Production:**

    ```bash
    pnpm build
    pnpm preview
    ```

## Project Structure

*   `app/`: Contains the core application files, including pages, components, layouts, and composables.
*   `server/`: Contains the server-side API endpoints.
*   `public/`: Contains the public assets of the application, such as the favicon.
*   `nuxt.config.ts`: The main configuration file for the Nuxt.js application.

## API Endpoints

The following API endpoints are available:

*  [API Docs](api-docs.md)

## Deployment

To deploy the application, you can use any platform that supports Node.js. Some popular options include:

*   [Vercel](https://vercel.com/)
*   [Netlify](https://www.netlify.com/)
*   [Render](https://render.com/)

## Contributing

Contributions are welcome! Please feel free to submit a pull request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## License

This project is licensed under the MIT License.
