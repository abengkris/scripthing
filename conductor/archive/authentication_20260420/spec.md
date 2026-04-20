# Specification: Implement Authentication

## Overview
Implement email/password authentication for the Scripthing screenplay writing application.

## Functional Requirements
- User Registration (Email/Password)
- User Login (Email/Password)
- JWT-based authentication
- Separate page for authentication

## Non-Functional Requirements
- Secure password hashing (bcrypt)
- JWT stateless authentication

## Acceptance Criteria
- User can register successfully.
- User can log in successfully.
- JWT is issued and stored.
- Logout invalidates the token.

## Out of Scope
- OAuth (Social login)
- Magic link login
