# Roxiller Systems Assignment 
Demo : [shubhamsomwanshi11-roxiller.vercel.app](https://shubhamsomwanshi11-roxiller.vercel.app)
(This may take time to load please wait..)

This project is an assignment for **Roxiller Systems**, where an API has been built to fetch data from a third-party API, initialize a database with seed data, and provide various endpoints for listing transactions, gathering statistics, and generating charts.


## Features
- **Data Fetching**: Fetches data from a third-party API.
- **Database Initialization**: Initializes MongoDB with seed data.
- **Endpoints**:
  - List transactions
  - Gather statistics
  - Generate bar charts and pie charts
  - Combine multiple responses
  
## Technologies Used
- **Frontend**: Deployed on Vercel
- **Backend**: Node.js, Express.js, MongoDB
- **Other Tools**: Third-party API, Chart generation libraries

## API Endpoints
### 1. List Transactions
`GET /api/transactions`  
Returns a list of transactions with details such as title, price, description, category, image, sold status, and dateOfSale.

### 2. Statistics
`GET /api/statistics`  
Provides statistics related to sales, revenue, and other metrics.

### 3. Bar Chart
`GET /api/chart/bar`  
Generates a bar chart with sales data.

### 4. Pie Chart
`GET /api/chart/pie`  
Generates a pie chart representing different sales categories.

### 5. Combined Responses
`GET /api/combined`  
Combines multiple responses, including transactions and charts.

## License
This project is licensed under the MIT License.
