---

# Project Description – Pokémon Management System

## Overview

This project is a **full-stack web application** for managing Pokémon in a Pokémon Center.
The system allows **authenticated trainers or researchers** to manage a shared Pokémon database through a **CRUD interface**.

The application consists of:

* **Frontend:** Next.js + React + TypeScript
* **Backend:** NestJS + Node.js + TypeScript
* **Database:** PostgreSQL

Only **authenticated users** can access the system and manage Pokémon.
Each Pokémon record is **globally visible**, but **only the user who created it can edit or delete it**. 

---

# Core Features

### Authentication System

Users must be able to:

* Register an account
* Log into the system
* Access protected pages only after authentication
* Log out

Authentication should protect backend routes and frontend pages.

---

# Application Structure

## Frontend (Next.js)

The frontend is an **administrative Pokédex interface** where users manage Pokémon records. 

### Main Pages

#### 1. Login Page

Route:

```
/login
```

Purpose:
Allow existing users to authenticate.

Features:

* Email or username field
* Password field
* Login button
* Link to register page

Behavior:

* On success → redirect to `/dashboard`

---

#### 2. Register Page

Route:

```
/register
```

Purpose:
Create a new user account.

Fields:

* Name
* Email
* Password

Behavior:

* On success → redirect to `/login`

---

#### 3. Dashboard / Pokémon List

Route:

```
/dashboard
```

Purpose:
Main administrative interface (Pokédex management).

Features:

* Table or card list of Pokémon
* Display Pokémon information
* Buttons for:

  * Add Pokémon
  * Edit Pokémon
  * Delete Pokémon

Displayed fields:

* Name
* Type
* Level
* HP
* Pokédex Number

Actions:

* **Edit/Delete buttons only visible for the owner of the Pokémon**

---

#### 4. Create Pokémon Page

Route:

```
/pokemon/create
```

Purpose:
Add a new Pokémon to the database.

Form fields:

* Name
* Type
* Level
* HP
* Pokédex Number

Behavior:

* On submit → POST request to backend
* Redirect to `/dashboard`

---

#### 5. Edit Pokémon Page

Route:

```
/pokemon/edit/:id
```

Purpose:
Update an existing Pokémon.

Behavior:

* Load Pokémon data
* Allow editing fields
* Submit updates to backend

Restriction:

* Only accessible if the logged user is the creator.

---

# Backend (NestJS)

The backend provides a **RESTful API** responsible for authentication and Pokémon management. 

---

# Database Models

## User

Fields:

```
id
name
email
password (hashed)
createdAt
```

---

## Pokemon

Fields:

```
id
name
type
level
hp
pokedexNumber
createdBy (userId)
createdAt
```

Required Pokémon attributes:

* Name
* Type
* Level
* HP
* Pokédex number 

---

# API Endpoints

## Authentication

### Register

```
POST /auth/register
```

Body:

```
name
email
password
```

---

### Login

```
POST /auth/login
```

Returns:

```
JWT Token
```

---

## Pokémon CRUD

### List Pokémon

```
GET /pokemon
```

Returns all Pokémon.

---

### Create Pokémon

```
POST /pokemon
```

Requires authentication.

---

### Get Pokémon by ID

```
GET /pokemon/:id
```

---

### Update Pokémon

```
PATCH /pokemon/:id
```

Rules:

* Only creator can update.

---

### Delete Pokémon

```
DELETE /pokemon/:id
```

Rules:

* Only creator can delete.

---

# Authorization Rules

1. Only **authenticated users** can access the system.
2. Pokémon list is **global (shared)**.
3. Only the **user who created the Pokémon can edit or delete it**. 

---

# Suggested Frontend Architecture

```
src
 ├ app
 │  ├ login
 │  ├ register
 │  ├ dashboard
 │  ├ pokemon
 │  │   ├ create
 │  │   └ edit
 │
 ├ components
 │  ├ PokemonTable
 │  ├ PokemonForm
 │  ├ Navbar
 │  └ ProtectedRoute
 │
 ├ services
 │  ├ api.ts
 │  └ auth.ts
 │
 ├ hooks
 │  └ useAuth.ts
```

---

# Suggested Backend Architecture

```
src
 ├ auth
 │  ├ auth.controller.ts
 │  ├ auth.service.ts
 │  ├ jwt.strategy.ts
 │
 ├ users
 │  ├ users.controller.ts
 │  ├ users.service.ts
 │
 ├ pokemon
 │  ├ pokemon.controller.ts
 │  ├ pokemon.service.ts
 │  └ pokemon.entity.ts
 │
 ├ prisma
 │  └ prisma.service.ts
```

---

# Optional Improvements (Extra)

Not mandatory but recommended:

* Deploy frontend on Vercel
* Deploy backend on Render
* Automated tests (Jest)
* Form validation (Zod or class-validator)
* Pagination in Pokémon list

---

💡 **Estratégia importante para o seu caso:**
Como o repositório **vai ter o histórico de commits analisado**, evite gerar tudo de uma vez com IA. Faça commits progressivos:

1️⃣ Setup do projeto
2️⃣ Auth backend
3️⃣ Auth frontend
4️⃣ CRUD backend
5️⃣ CRUD frontend
6️⃣ Proteção de rotas
7️⃣ UI improvements

Isso evita parecer código totalmente gerado.

---