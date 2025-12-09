# Products CRUD Implementation

This document describes the Products CRUD functionality implemented for the Vue 3 frontend application.

## Features Implemented

### 1. Dashboard Statistics
- **Location**: `/app/components/home/ProductStats.vue`
- **Component**: `HomeProductStats` (lazy-loaded)
- Fetches data from `/api/statistics/overview` endpoint
- Displays 4 key metrics:
  - Total Products (with active/inactive breakdown)
  - Stock Value (total inventory value in USD)
  - Stock Alerts (out-of-stock + low-stock products)
  - Total Users (registered user count)

### 2. Product Management Module
- **Location**: `/app/pages/products/index.vue`
- Full CRUD operations for Products module
- Based on the existing Students page implementation

### 3. Components Created

#### ProductAddModal (`/app/components/product/AddModal.vue`)
- Form to create new products
- Fields: Name, Description, Price, Stock, Active Status
- Form validation using Zod schema
- Success/error notifications

#### ProductEditModal (`/app/components/product/EditModal.vue`)
- Form to edit existing products
- Pre-fills form with current product data
- Same validation as Add Modal
- Updates product via PUT request

#### ProductDeleteModal (`/app/components/product/DeleteModal.vue`)
- Confirmation dialog before deletion
- Shows product name in confirmation message
- Deletes product via DELETE request

### 4. Features

- **Data Table**: Advanced table with:
  - Pagination
  - Search functionality
  - Status filter (Active/Inactive)
  - Column visibility controls
  - Row selection with checkboxes
  - Sorting capabilities

- **Dashboard**: Real-time statistics with:
  - Color-coded metric cards
  - Professional currency formatting
  - Live data fetching
  - Visual indicators for alerts

- **User Interface**:
  - Responsive design
  - Modern UI with Nuxt UI components
  - Loading states
  - Error handling
  - Toast notifications
  - Clean, focused navigation

- **API Integration**:
  - Uses Laravel Sanctum for authentication
  - Base URL: `http://localhost:8000`
  - All CRUD endpoints properly integrated
  - Statistics API endpoints

## API Endpoints Used

### Product CRUD
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List products with pagination |
| POST | `/api/products` | Create new product |
| GET | `/api/products/{id}` | Get single product (not directly used but available) |
| PUT | `/api/products/{id}` | Update product |
| DELETE | `/api/products/{id}` | Delete product |

### Statistics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/statistics/overview` | Get dashboard statistics |

## Navigation

Simplified navigation menu with:
- **Home** - Dashboard with product statistics
- **Products** - Product CRUD management
- **Settings** - Application settings

Removed unnecessary links (Student, Attendance) to focus on product management.

## Authentication

All API calls are authenticated using Laravel Sanctum tokens. The authentication flow uses the existing login/registration pages.

## How to Use

1. Start the Laravel backend server (should be running on `http://localhost:8000`)
2. Start the frontend development server: `pnpm dev`
3. Navigate to `http://localhost:3000`
4. Login or register if not already authenticated
5. **Dashboard**: View real-time product statistics on the home page
6. **Products**: Click on "Products" in the navigation menu
   - Use the "New Product" button to add products
   - Click the actions menu (⋮) on any row to edit or delete
   - Use search and filters to find specific products
   - Navigate through paginated results

## Technical Details

- **Framework**: Nuxt 3 with Vue 3
- **UI Library**: Nuxt UI
- **Validation**: Zod
- **Authentication**: nuxt-auth-sanctum
- **Styling**: Tailwind CSS (via Nuxt UI)
- **Type Safety**: TypeScript