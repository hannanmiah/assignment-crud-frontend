# Product Management System

A full-stack CRUD application for product management built with Vue 3 (Nuxt.js) and Laravel backend.

## Features

*   **Product CRUD:** Complete Create, Read, Update, Delete operations for products
*   **Dashboard:** Real-time statistics including total products, stock value, stock alerts, and user count
*   **Authentication:** User registration and login using Laravel Sanctum
*   **Data Management:** Advanced data table with pagination, search, and filtering
*   **Responsive UI:** Modern, mobile-friendly interface using Nuxt UI components

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   [Node.js](https://nodejs.org/) (v18 or newer)
*   [pnpm](https://pnpm.io/)

### Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/hannanmiah/attendance-management-frontend.git
    cd assignment-frontend
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
    *   `pages/`: Application pages (Home, Products, Settings, Login, Register)
    *   `components/`: Reusable Vue components
        *   `home/`: Dashboard components
        *   `product/`: Product CRUD components
    *   `layouts/`: Application layouts
    *   `types/`: TypeScript type definitions
*   `public/`: Contains the public assets of the application, such as the favicon.
*   `nuxt.config.ts`: The main configuration file for the Nuxt.js application.

## API Endpoints

The following API endpoints are available:

*  [API Documentation](api-docs.md) - Complete list of all available endpoints including Products, Authentication, and Statistics

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
