# 🏠 Wanderlust - AirBnb Clone

A full-stack web application inspired by AirBnb, built with Node.js, Express, and MongoDB. This project allows users to browse, create, and review property listings.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [API Routes](#api-routes)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [Author](#author)
- [License](#license)

## ✨ Features

### User Authentication & Authorization
- 🔐 User registration and login using Passport.js
- 🔒 Session-based authentication
- 👤 User profile management
- 🛡️ Protected routes for authenticated users only

### Listing Management
- 📝 Create new property listings
- ✏️ Edit existing listings (owner only)
- 🗑️ Delete listings (owner only)
- 🔍 Browse all available listings
- 📊 View detailed listing information

### Review System
- ⭐ Add reviews and ratings to listings
- 💬 View all reviews for a listing
- 🗑️ Delete own reviews (author only)
- 📈 Rating system (1-5 stars)

### Additional Features
- 🎨 Responsive UI with EJS templates
- ⚡ Flash messages for user feedback
- ✅ Server-side validation using Joi
- 🛠️ Error handling middleware
- 🔄 RESTful API design
- 🎯 MVC architecture pattern

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling

### Authentication
- **Passport.js** - Authentication middleware
- **Passport-Local** - Local authentication strategy
- **Passport-Local-Mongoose** - Mongoose plugin for user authentication

### Templating & UI
- **EJS** - Embedded JavaScript templating
- **EJS-Mate** - Layout support for EJS
- **Bootstrap** - CSS framework (assumed)

### Validation & Security
- **Joi** - Schema validation
- **Express-Session** - Session management
- **Connect-Flash** - Flash messages
- **Cookie-Parser** - Cookie parsing middleware

### Utilities
- **Method-Override** - HTTP method override for PUT/DELETE

## 📁 Project Structure

```
AirBnb_MajorProject1/
├── models/
│   ├── listing.js          # Listing schema and model
│   ├── reviews.js          # Review schema and model
│   └── user.js             # User schema and model
├── routes/
│   ├── listing.js          # Listing routes
│   ├── review.js           # Review routes
│   └── user.js             # User authentication routes
├── views/
│   ├── listings/           # Listing views
│   ├── users/              # User views
│   └── includes/           # Partial templates
├── public/
│   ├── css/                # Stylesheets
│   └── js/                 # Client-side JavaScript
├── utils/
│   ├── wrapAsync.js        # Async error handler
│   └── ExpressErrors.js    # Custom error class
├── init/
│   ├── index.js            # Database initialization
│   └── data.js             # Sample data
├── middleware.js           # Custom middleware functions
├── joiSchema.js            # Joi validation schemas
├── app.js                  # Main application file
└── package.json            # Project dependencies
```

## 🚀 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/AzizAmaanAhmed887/Airbnb_MajorProject1.git
   cd Airbnb_MajorProject1
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start MongoDB**
   ```bash
   # Make sure MongoDB is running on localhost:27017
   mongod
   ```

4. **Initialize the database (optional)**
   ```bash
   node init/index.js
   ```

5. **Start the application**
   ```bash
   node app.js
   ```

6. **Open your browser**
   ```
   Navigate to: http://localhost:8080
   ```

## 💻 Usage

### Creating an Account
1. Click on "Sign Up" in the navigation bar
2. Fill in your username, email, and password
3. Submit the form to create your account

### Creating a Listing
1. Log in to your account
2. Click on "Create New Listing"
3. Fill in the listing details (title, description, image, price, location, country)
4. Submit the form

### Adding a Review
1. Navigate to any listing detail page
2. Scroll down to the review section
3. Add your rating and comment
4. Submit the review

### Editing/Deleting Listings
- Only the owner of a listing can edit or delete it
- Click "Edit" or "Delete" buttons on your own listings

## 🛣️ API Routes

### Listing Routes
| Method | Route | Description | Auth Required |
|--------|-------|-------------|---------------|
| GET | `/` | Home page | No |
| GET | `/listings` | View all listings | No |
| GET | `/listings/new` | New listing form | Yes |
| POST | `/listings` | Create new listing | Yes |
| GET | `/listings/:id` | View listing details | No |
| GET | `/listings/:id/edit` | Edit listing form | Yes (Owner) |
| PUT | `/listings/:id` | Update listing | Yes (Owner) |
| DELETE | `/listings/:id` | Delete listing | Yes (Owner) |

### Review Routes
| Method | Route | Description | Auth Required |
|--------|-------|-------------|---------------|
| POST | `/listings/:id/reviews` | Add review | Yes |
| DELETE | `/listings/:id/reviews/:reviewId` | Delete review | Yes (Author) |

### User Routes
| Method | Route | Description | Auth Required |
|--------|-------|-------------|---------------|
| GET | `/user/signup` | Signup form | No |
| POST | `/user/signup` | Register user | No |
| GET | `/user/login` | Login form | No |
| POST | `/user/login` | Authenticate user | No |
| GET | `/user/logout` | Logout user | Yes |

## 🎨 Screenshots

> Add screenshots of your application here

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

## 👨‍💻 Author

**Aziz Amaan Ahmed**

- GitHub: [@AzizAmaanAhmed887](https://github.com/AzizAmaanAhmed887)

## 📝 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- Inspired by AirBnb
- Built as part of Apna College Sigma 6.0 Web Development Course
- Thanks to all contributors and supporters

---

⭐ If you found this project helpful, please give it a star!
