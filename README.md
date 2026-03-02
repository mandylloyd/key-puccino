# ☕ Key-Puccino

A role-based authentication demo that simulates a café workflow using React, React Router, Docker, and Keycloak.

This project demonstrates real-world authentication architecture, route protection, and role-based access control (RBAC) in a modern frontend application.

# Project Concept

## Key-Puccino models three distinct user roles within a single application:

`Guest` → Create and submit an order

`Barista` → Complete a mini game to prepare the order

`Manager` → View scores and leaderboard data

Each role has restricted access to specific routes and UI states based on Keycloak-issued tokens.

# Authentication & Authorization

- Identity provider: Keycloak

- Realm: key-puccino

- Roles: guest, barista, manager

- Client configured for SPA with role mappings

- Protected routes

Authentication state is derived from Keycloak, and access is conditionally rendered based on permissions.

# Architecture Overview

- React frontend

- React Router for protected navigation

- Keycloak for identity management

- Docker for containerized auth environment

- Enforces UI-level and route-level authorization
