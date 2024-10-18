# Plana - Event Management Platform 🎫
![PLAN-A Logo](https://res.cloudinary.com/ddqdsuiwr/image/upload/v1729248010/event_posters/Screenshot_from_2024-10-18_13-39-48_ampvzv.png)

Plana is a comprehensive event management platform that facilitates event creation, management, and attendance. Built with Node.js and Angular, it provides a seamless experience for event organizers and attendees alike.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features

### User Roles & Permissions

#### Attendee (Default Role)
- Account creation and management
- Browse events by categories
- Book event tickets
- Receive email confirmations
- Request Event Manager status upgrade

#### Event Manager
- Create and manage events
- Track bookings and attendance
- Access event analytics
- All Attendee privileges included

#### Admin
- User role management
- Category creation and management
- System configuration
- User request approval/rejection
- Full platform oversight

### Core Features
- **User Authentication & Authorization**
 - Secure signup and login
 - Role-based access control
 - JWT token authentication

- **Email Notifications**
 - Welcome emails for new users
 - Booking confirmations
 - Ticket delivery
 - Status change notifications

- **Event Management**
 - Category-based organization
 - Ticket management
 - Booking tracking
 - Event analytics

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Architecture**: Modular design pattern
 - Services layer
 - Controller layer
 - Routes layer
 - Background services

### Frontend
- **Framework**: Angular
- **Architecture**: Component-based
 - Module-specific components
 - Shared services
 - Reusable UI components

### Database
- **Type**: [Your Database Type]
- **ORM**: [Your ORM if any]

## Prerequisites
Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm (v6 or higher)
- Angular CLI
- [Your Database]

## Installation

1. **Clone the Repository**
```bash
git clone https://github.com/Earl006/Plana.git
cd Plana

cd backend
npm install

cd ../frontend
npm install
```
## Running the Application

1. **Backend**
```bash
cd backend
npm run dev
```
2. **Frontend**
```bash
cd frontend
ng serve
```

**Access the application at:**

- Frontend: http://localhost:4200
- Backend API: http://localhost:3000

## PROJECT STRUCTURE
plana/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   ├── event.controller.ts
│   │   │   └── user.controller.ts
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   ├── email.service.ts
│   │   │   └── event.service.ts
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── event.routes.ts
│   │   │   └── user.routes.ts
│   │   ├── background-services/
│   │   │   ├── email-queue.service.ts
│   │   │   └── notification.service.ts
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── admin/
    │   │   │   ├── dashboard/
    │   │   │   ├── user-management/
    │   │   │   └── category-management/
    │   │   ├── event-manager/
    │   │   │   ├── event-creation/
    │   │   │   └── event-management/
    │   │   ├── attendee/
    │   │   │   ├── event-booking/
    │   │   │   └── ticket-management/
    │   │   └── shared/
    │   └── environments/
    └── package.json

## License
- This project is licensed under the MIT License - see the LICENSE file for details.
- Contact
- Developer: Earljoe Kadima
- Email: earljoe06@gmail.com
- Project Link: https://github.com/Earl006/Plana

Made with ❤️ by Earljoe Kadima