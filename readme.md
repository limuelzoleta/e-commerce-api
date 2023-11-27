Existing users you may use:

ADMIN USER
email: admin@mail.com
password: admin

REGULAR USER
email: user@mail.com
password: user

Features and Guide to Simulate the Backend Functionalities through Postman

1 - USER REGISTRATION
POST
localhost:4001/users/register

Enter the necessary information for registration in req.body in JSON format:
Sample:
{
"firstName": "Admin24",
"lastName": "Admin",
"email": "admin24@mail.com",
"password": "admin24",
"mobileNo": "09987654321",
"shippingAddress": "Makati",
"cartId":""
}

It will return a message that the resgistration is successful or not.

Note: Every user needs to have a unique email, so it returns an error when duplication of email occurs upon registration.

2 - USER AUTHENTICATION / USER LOGIN
POST
localhost:4001/users/login

Enter the necessary info in req.body in JSON Format
Sample:

{
"email": "user@mail.com",
"password": "user"
}

This will return a token that you can copy and paste in authorization (header) to use the other features.

3 - UPDATE USER AS ADMIN (For Admin Only)
PUT
localhost:4001/users/update-admin

Enter the necessary info in req.body in JSON Format
Sample:

{
"userId":"654d6fa21fc2969be0cb695d"
}

If not admin, it will return:
{
"auth": "Failed",
"message": "Action Forbidden!"
}

If Admin, it will return:
{
"message": "User updated to admin successfully"
}

4 - CREATE PRODUCT (Admin only)
POST
localhost:4001/products/

Enter the necessary info in req.body in JSON Format
Sample:

{
"name": "pencil case",
"description": "scratch-resistant pen holders",
"price": 1299,
"stockQuantity": 20
}

it will return true if successful, and false if not

5 - GET ACTIVE PRODUCTS
GET
localhost:4001/products/

No req.body needed

It will return an array of active products

6 - GET ALL PRODUCTS
GET
localhost:4001/products/all

No req.body needed

It will return an array all the products active and inactive.

7 - GET A SPECIFIC PRODUCT
GET
localhost:4001/products/:productId
(sample productId : 654c4673fe51d160cf01e982)

It will return the details of the product.

8 - ARCHIVE A PRODUCT (Admin only)
PUT
localhost:4001/products/:productId/archive
sample productId: 654c4673fe51d160cf01e982

No req.body needed

It will return true or false, if successful or not, respectively.

9 - UPDATE PRODUCT INFORMATION (Admin only)
PUT
localhost:4001/products/:productId
sample productId: 654c4673fe51d160cf01e982

Enter the necessary info in req.body in JSON Format
Sample:
{
"stockQuantity": 25
}

It will return true or false, if successful or not, respectively.

10 - ACTIVATE A PRODUCT (Admin only)
PATCH
localhost:4001/products/:productId/activate
sample productId: 654c4673fe51d160cf01e982

No req.body needed.

It will return true or false, if successful or not, respectively.

11 - USER GET DETAILS
GET
localhost:4001/users/:userId/userDetails
sample userId: 654d6f931fc2969be0cb6959

No req.body needed.

It will return you the details of the user who owns that unique user ID.

12 - ADD TO CART (Non-Admin)
(To try this, you need are encouraged to register or use a non-admin user.)
POST
localhost:4001/cart/add-product

Enter the necessary info in req.body in JSON Format
Sample:
{
"productId": "654c4673fe51d160cf01e982"
}

you may add "quantity": Number

// Not yet done. To be updated.
