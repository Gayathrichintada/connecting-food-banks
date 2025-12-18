# Connecting Food Banks

**Connecting Food Banks** is a web application designed to reduce food wastage and help people in need by connecting donors, food banks, and users requesting food.  

---

## **Features**

- **Donor Registration & Donation**
  - Donors can register with their details.  
  - Donors can donate food items with quantity.  
  - Donations are tracked with status: `available`, `requested`, or `accepted`.

- **User Registration & Requests**
  - Users can register with their details.  
  - Users can view available donations and send requests to donors.  
  - Requests have status: `pending` or `accepted`.

- **Food Bank Management**
  - Food banks can view all pending user requests.  
  - Food banks can accept requests, updating request and donation status.  
  - Shows user and donor names for better clarity.  

- **Real-time Status Updates**
  - Users, donors, and food banks always see the latest status of donations and requests.  

---

## **Technologies Used**

- **Frontend**: HTML, CSS, JavaScript  
- **Backend**: Node.js, Express  
- **Database**: MySQL  
- **Authentication & Security**: bcrypt for password hashing  
- **Others**: CORS, dotenv  

---

## **Folder Structure**

.
├── server.js # Node.js server
├── .env # Environment variables
├── index.html # Main home page
├── donor-register.html # Donor registration & donation
├── user-register.html # User registration & request
├── food-bank.html # Food bank management
├── about.html # About page
├── app.js # JavaScript for frontend functionality
└── README.md # Project documentation


---

## **Database Tables**

1. **donors** – stores donor details.  
2. **users** – stores user details.  
3. **donations** – tracks donated food items and status.  
4. **donor_requests** – stores requests made by users for specific donations.  

---

## **Setup Instructions**

1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/connecting-food-banks.git
cd connecting-food-banks


Install dependencies:

npm install


Create a .env file in the root folder:

DB_HOST=localhost
DB_USER=your_db_username
DB_PASSWORD=your_db_password
DB_NAME=foodbank_db
PORT=3000
JWT_SECRET=your_secret_key


Set up the database in MySQL using the tables described above.

Start the server:

node server.js


Open the application in your browser:

http://localhost:3000

Usage

Donors

Register → Donate food → Track donation status.

Users

Register → View available donations → Request food → Track request status.

Food Banks

View all pending requests → Accept requests → Update donation status.

Future Enhancements

Add authentication/login for donors, users, and food banks.

Add notifications for request status updates.

Add location-based food bank suggestions.

Add quantity adjustment when multiple users request the same donation.
