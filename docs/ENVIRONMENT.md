# Environment Variables

This project requires a `.env` file at the root of the repository to configure database connections, authentication, API keys, and other app settings.

Copy `.env.example` → `.env` and fill in the following variables:

---

## 🔹 Required Variables

| Variable                | Description                                           | Example / Notes                                               |
| ----------------------- | ----------------------------------------------------- | ------------------------------------------------------------- |
| `NEXT_PUBLIC_BASE_URL`  | Base URL of your app                                  | `http://localhost:3000` or your production domain             |
| `DB_URI`                | MongoDB connection string                             | `mongodb+srv://username:password@cluster0.mongodb.net/dbname` |
| `UPLOADTHING_TOKEN`     | Token for file upload service (UploadThing)           | Provided by UploadThing dashboard                             |
| `AUTH_SECRET`           | Secret key for authentication/session encryption      | Random 32+ character string                                   |
| `AUTH_RESEND_KEY`       | Key used for resending authentication tokens/emails   | Random string                                                 |
| `SALT_ROUND`            | Number of salt rounds for password hashing            | `10` (default)                                                |
| `EMAIL_USER`            | SMTP email username (for sending notifications)       | `your@email.com`                                              |
| `EMAIL_PASS`            | SMTP email password                                   | `yourEmailPassword`                                           |
| `WOO_KEY`               | WooCommerce API key                                   | Obtain from WooCommerce > Settings > Advanced > REST API      |
| `WOO_SECRET`            | WooCommerce API secret                                | Provided alongside `WOO_KEY`                                  |
| `SHOPIFY_CLIENT_ID`     | Shopify app client ID                                 | Required if integrating Shopify features                      |
| `SHOPIFY_CLIENT_SECRET` | Shopify app client secret                             | Provided by Shopify Partners dashboard                        |
| `WOO_API_URI`           | Base URI for WooCommerce API                          | e.g., `https://yourshop.com/wp-json/wc/v3`                    |
| `WOO_API_QUERY_LIMIT`   | Number of records fetched per WooCommerce API request | `100` (default)                                               |
| `DEFAULT_DATE_INTERVAL` | Default interval for reports in days                  | `14`                                                          |

---

## 🔹 Sample `.env` Template

```NEXT_PUBLIC_BASE_URL = http://localhost:3000
DB_URI = mongodb+srv://username:password@cluster0.mongodb.net/woo_order_management
UPLOADTHING_TOKEN = your_uploadthing_token
AUTH_SECRET = supersecretkey123456789
AUTH_RESEND_KEY = resendkey123
SALT_ROUND = 10
EMAIL_USER = your@email.com
EMAIL_PASS = yourEmailPassword
colors = "primary = blue,secondary = green"
WOO_KEY = ck_yourwoocommercekey
WOO_SECRET = cs_yourwoocommercekey
SHOPIFY_CLIENT_ID = yourshopifyclientid
SHOPIFY_CLIENT_SECRET = yourshopifyclientsecret
WOO_API_URI = https://yourshop.com/wp-json/wc/v3
WOO_API_QUERY_LIMIT = 100
DEFAULT_DATE_INTERVAL = 14
```
