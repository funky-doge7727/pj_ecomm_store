This is a cake e-commerce store. Specifically, this e-commerce application has the following features:

Tech Stack Used: Node.js, Mongoose, Express and EJS

From the public user (i.e. users who are not logged in) perspective:

1. They will only be allowed to perform the following:

- Read the general information in the website
- Browse the cake shop without purchasing
- See the location of the shop by clicking the "Contact" tab, and provide feedback (with the need to key in their name and email).

2. As public users browse through the cake shop, click a specific product and click "Add to cart", they will be redirected and be prompted to log in as a customer.


From the customer perspective:

1. Customers can do what the public users can do as stated in Point 1 above. On top of which, they can perform the following operations:

- Add a cake to cart (this gives a default value of "1" for the cupcake that they have added to cart)
- Go to shopping cart and adjust the quantity of cupcakes they require. 
- User can also delete the cupcake if they no longer need it by pressing the "x" button.
- Checkout and choose between using the default address (based on what they have keyed in during the sign up stage), or choose a different address
- View their order status (in progress/fulfilled by a specific admin) by clicking the "My Orders" tab.  

2. When customers want to provide feedback, they will only need to type in their feedback, as opposed to public users where they have to key in their username and email.

From the shop owner and staff (collectively known as "admin") perspective

1. The ability for admin to upload new cupcake products. Specifically, the admin can define the following:

- cupcake product
- description
- level of sweetness (0% to 100%)
- price
- quantity

2. Upon creation of the new cupcake product, the admin can choose to amend the attributes of each cupcake product above, or delete the entire product.

3. Once a customer has made an order, the order will be registered under the "All orders" tab. 

4. Further to point 3 above, upon clicking the "All orders" tab, admin can click into each order tab to view the order details. Once the orders have been prepared, the admin can click the "fulfil" button. The order will then be registered as fulfilled with the admin's username being logged.

5. The admin can also view all feedback from public and registered users by clicking the "View Feedback" tab. This "View Feedback" tab is not available to non-admins (i.e. customers and the public).

Functionalities to improve on

- Quantity check for e-commerce shop
- Confirmation prompt using modals to prevent accidental clicking
- Have multiple content page split (e.g. page 1, 2, 3) so that the respective index webpages / summaries will not be lengthy
- Further aesthetics of the website (i.e. alert prompts)
- Detailed view of feedback, and function to select feedback as "important"
- Usage of passport.js for authentication
- Usage of regex (say for credit card authorisation, email authorisation etc..)

Credits to colorlib (https://colorlib.com/) for the webpage design.