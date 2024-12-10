# ATOMS-DMS-APP-UI

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.2.10.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.



Here's a better folder structure for your Angular project. This structure is organized and follows Angular's best practices, making it scalable and easier to maintain:

ATOMS-DMS-APP Folder Structure
-------------------------------

src
│
├── app
│   ├── core             // Core module for singleton services and global components
│   │   ├── guards       // Route guards
│   │   ├── interceptors // HTTP interceptors
│   │   ├── services     // Singleton services (e.g., AuthService)
│   │   ├── components   // Global reusable components (e.g., Header, Footer)
│   │   └── core.module.ts
│   │
│   ├── shared           // Shared module for reusable components, directives, pipes
│   │   ├── components   // Shared components (e.g., Button, Modal)
│   │   ├── directives   // Custom directives
│   │   ├── pipes        // Reusable pipes
│   │   └── shared.module.ts
│   │
│   ├── features         // Feature modules (lazy-loaded)
│   │   ├── employees    // Employee-related features
│   │   │   ├── components
│   │   │   ├── services
│   │   │   └── employees.module.ts
│   │   ├── marketing    // Marketing-related features
│   │   │   ├── components
│   │   │   ├── services
│   │   │   └── marketing.module.ts
│   │   ├── dashboard    // Dashboard module
│   │   │   ├── components
│   │   │   └── dashboard.module.ts
│   │   └── auth         // Authentication module
│   │       ├── components
│   │       ├── services
│   │       └── auth.module.ts
│   │
│   ├── layouts          // Layout modules (e.g., AdminLayout, UserLayout)
│   │   ├── admin-layout
│   │   │   ├── components
│   │   │   ├── admin-layout.component.html
│   │   │   ├── admin-layout.component.ts
│   │   │   └── admin-layout.module.ts
│   │   └── user-layout
│   │       ├── components
│   │       ├── user-layout.component.html
│   │       ├── user-layout.component.ts
│   │       └── user-layout.module.ts
│   │
│   ├── models           // Shared interfaces and types
│   ├── app-routing.module.ts
│   ├── app.component.html
│   ├── app.component.ts
│   └── app.module.ts
│
├── assets               // Static assets (images, JSON, etc.)
├── environments         // Environment configuration files
└── styles               // Global styles (CSS/SCSS)


Benefits of This Structure:
----------------------------
Scalability: Easily add new features without cluttering the codebase.
Reusability: Shared components, directives, and pipes are centralized.
Improved Performance: Lazy loading ensures only the necessary modules are loaded, reducing initial load time.
Maintainability: Clear separation of concerns makes it easier to debug and modify.

# Create employees module
ng g module features/employees --module app-routing --route employees

# Create marketing module
ng g module features/marketing --module app-routing --route marketing

# Create dashboard module
ng g module features/dashboard --module app-routing --route dashboard

# Create auth module
ng g module features/auth --module app-routing --route auth

# Inside each feature module, create components and services
ng g component features/employees/components/employees-list
ng g component features/employees/components/add-employee
ng g service features/employees/services/employees

ng g component features/marketing/components/lead-management
ng g service features/marketing/services/marketing

ng g component features/dashboard/components/dashboard-home
ng g service features/dashboard/services/dashboard

ng g component features/auth/components/login
ng g service features/auth/services/auth
