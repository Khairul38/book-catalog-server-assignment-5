### Live Link: https://book-catalog-server-assignment-5.vercel.app

### Application Routes:

### Auth (User)

- Route: https://book-catalog-server-assignment-5.vercel.app/api/v1/auth/login (POST)
- Route: https://book-catalog-server-assignment-5.vercel.app/api/v1/auth/signup (POST)
- Route: https://book-catalog-server-assignment-5.vercel.app/api/v1/auth/refresh-token (POST)

#### Books

- Route: https://book-catalog-server-assignment-5.vercel.app/api/v1/books (POST)
- Route: https://book-catalog-server-assignment-5.vercel.app/api/v1/books (GET)
- Route: https://book-catalog-server-assignment-5.vercel.app/api/v1/books/6177a5b87d32123f08d2f5d4 (Single GET) Include an id that is saved in your database
- Route: https://book-catalog-server-assignment-5.vercel.app/api/v1/books/6177a5b87d32123f08d2f5d4 (PATCH) Include an id that is saved in your database
- Route: https://book-catalog-server-assignment-5.vercel.app/api/v1/books/6177a5b87d32123f08d2f5d4 (DELETE) Include an id that is saved in your database

#### Wishlist

- Route: https://book-catalog-server-assignment-5.vercel.app/api/v1/wishlist (POST)
- Route: https://book-catalog-server-assignment-5.vercel.app/api/v1/wishlist/user (All GET By User)
- Route: https://book-catalog-server-assignment-5.vercel.app/api/v1/wishlist/6177a5b87d32123f08d2f5d4 (Single GET By Book Id) Include an id that is saved in your database
- Route: https://book-catalog-server-assignment-5.vercel.app/api/v1/wishlist/6177a5b87d32123f08d2f5d4 (PATCH) Include an id that is saved in your database
- Route: https://book-catalog-server-assignment-5.vercel.app/api/v1/wishlist/6177a5b87d32123f08d2f5d4 (DELETE) Include an id that is saved in your database

#### Reviews

- Route: https://book-catalog-server-assignment-5.vercel.app/api/v1/reviews/6177a5b87d32123f08d2f5d4 (POST By Book Id) Include an id that is saved in your database
- Route: https://book-catalog-server-assignment-5.vercel.app/api/v1/reviews/6177a5b87d32123f08d2f5d4 (All GET By Book Id) Include an id that is saved in your database
