# 🧪 React Practical Test – Task Requirements

This project is a practical assessment to evaluate your React.js fundamentals, authentication flow, CRUD operations, filtering, and UI handling. The task includes implementing a landing page, authentication using LocalStorage, and product operations using the provided Postman API collection.

---

## 🚀 Features to Build

### 1. **Landing Page**

* Navbar with:

  * Logo (Home page)
  * Login (Login Page)
  * Signup (Sign up Page)
* Image Carousel (use given images)
* Rest of the UI is based on your creativity

---

## 📝 2. Sign Up Page

**Fields Required:**

* Username
* Email
* Password
* Confirm Password

**Validation Required:**

* All fields mandatory
* Password and Confirm Password must match
* Email format validation

**Important:**
✔ Store Sign Up data in **LocalStorage**
✔ No API exists for signup in Postman

---

## 🔐 3. Login Page

**Fields:**

* Username
* Password

**Rules:**

* Only users stored during signup (LocalStorage) can log in
* No login API available

---

## 🔄 4. Auth-based Navbar Behavior

After login/signup:

* Replace Login/Signup with **Logout**
* Display Logged-in Username in navbar
* Logout should clear session and redirect to Login Page

---

## 📦 5. Product Management (Protected Routes)

Accessible **ONLY after login/signup**.

### Product Table Fields:

* Product Title
* Product Description
* Product Price
* Product Category
* Action (View | Edit | Delete)

### Actions:

#### ▶ View

Open a modal showing product details.

#### ✏ Update

* Open editable form
* On submit → update from localstorage and also update api called

#### 🗑 Delete

* Remove product
* Confirm Deletion
* On delete → removed from localstorage and also delete api called

---

## 🔍 6. Search Functionality

* Implemented search bar
* Search should filter products **in the table** by title/description/category/etc.

---

## 📂 7. Dropdown Filter

* Add dropdown to filter table data by **category** or other product fields.

---

## 🛠 Tech Stack

* React.js
* React Router
* LocalStorage
* Fetch for API calls
* Tailwind CSS or Bootstrap (optional)

---

## ▶ How to Run

```bash
npm install
npm start
```

---

## 📁 Project Structure (Suggested)

```
src/
│── components/
│── pages/
│── hooks/
│── services/
│── context/
│── assets/
│── App.jsx
```

---

## 🎯 Structure

* Clean code
* Folder structure
* Form validation
* Routing & Protected routes
* API handling
* UI quality
* State management
* Reusable components

** Project created using vite **

