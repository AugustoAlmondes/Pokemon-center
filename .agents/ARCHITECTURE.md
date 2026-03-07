---
# System Architecture

This document describes the architecture of the **Pokemon Management System**.

The system is divided into:

- Frontend (Next.js)
- Backend (NestJS)
- Database (PostgreSQL/Supabase)

---

# High Level Architecture

User
↓
Frontend (Next.js)
↓
API (NestJS)
↓
Database (PostgreSQL)

Authentication uses JWT.

---

# Backend Architecture

Backend is built using **NestJS modular architecture**.

Main modules:

auth  
users  
pokemon

---

# Backend Folder Structure

src

app.module.ts

auth/
- auth.module.ts
- auth.controller.ts
- auth.service.ts
- jwt.strategy.ts
- jwt.guard.ts

users/
- users.module.ts
- users.service.ts
- users.controller.ts

pokemon/
- pokemon.module.ts
- pokemon.controller.ts
- pokemon.service.ts
- dto/

prisma/
- prisma.service.ts

---

# Database Design

## Users Table

Fields

id (uuid)

name

email (unique)

password (hashed)

createdAt

---

## Pokemon Table

Fields

id (uuid)

name

type

level

hp

pokedexNumber

createdBy (user id)

createdAt

---

# Entity Relationship

User
│
│ 1
│
└───< Pokemon

One user can create many pokemons.

Each pokemon belongs to a single user.

---

# Authentication Flow

Register

User submits:

name  
email  
password  

Password is hashed before saving.

---

Login

User submits:

email  
password  

If credentials are valid:

Server returns JWT token.

---

Authenticated Requests

Frontend sends:

Authorization: Bearer TOKEN

Backend validates token using JWT strategy.

---

# Pokemon CRUD Flow

Create Pokemon

User submits:

name  
type  
level  
hp  
pokedexNumber  

Backend attaches:

createdBy = authenticated user id.

---

List Pokemons

Returns all pokemons.

Include creator id.

Frontend decides whether edit/delete buttons should appear.

---

Edit Pokemon

Allowed only if:

pokemon.createdBy == currentUser.id

---

Delete Pokemon

Allowed only if:

pokemon.createdBy == currentUser.id

---

# Frontend Architecture

The frontend is built with **Next.js App Router**.

---

# Frontend Folder Structure

src

app/

login/
page.tsx

register/
page.tsx

dashboard/
page.tsx

pokemon/

create/
page.tsx

edit/[id]/
page.tsx

---

components/

Navbar.tsx

PokemonTable.tsx

PokemonForm.tsx

ProtectedRoute.tsx

---

services/

api.ts

auth.ts

pokemon.ts

---

hooks/

useAuth.ts

---

types/

pokemon.ts

user.ts

---

# Main Pages

Login Page

Allows existing users to authenticate.

Fields:

email  
password  

Redirects to dashboard after success.

---

Register Page

Creates new users.

Fields:

name  
email  
password  

---

Dashboard Page

Displays a list of Pokemons.

Features:

table of pokemons  
add pokemon button  
edit button  
delete button  

Edit/Delete only visible for owner.

---

Create Pokemon Page

Form with fields:

name  
type  
level  
hp  
pokedexNumber

---

Edit Pokemon Page

Loads pokemon data and allows editing.

---

# Security Rules

Only authenticated users can access:

dashboard  
pokemon create  
pokemon edit  

JWT must be validated on backend.

Frontend must redirect unauthenticated users to login.

---