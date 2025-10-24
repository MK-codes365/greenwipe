# Neon Database Setup

1. Create a Neon Account:
   - Go to https://neon.tech
   - Sign up for a free account
   - Create a new project

2. Get Your Connection String:
   - In your Neon dashboard, go to your project
   - Click "Connection Details"
   - Copy the connection string that looks like:
     ```
     postgresql://[user]:[password]@[endpoint]/[dbname]
     ```

3. Set Up Local Environment:
   - Create or update your `.env` file:
     ```env
     DATABASE_URL="your-neon-connection-string"
     ```

4. Initialize Database:
   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run migrations
   npx prisma migrate deploy

   # Initialize database (creates default stats)
   npx ts-node scripts/init-db.ts
   ```

5. Vercel Deployment:
   - In your Vercel project settings
   - Add the `DATABASE_URL` environment variable
   - Use the same Neon connection string
   - Redeploy your project

## Troubleshooting

If you encounter connection issues:

1. Verify your connection string is correct
2. Check that your IP is allowed in Neon's access control
3. Ensure you're using the correct password
4. Try connecting with `psql` to verify direct access

## Connection String Format

Your Neon connection string should look like:
```
postgresql://[user]:[password]@[endpoint]/[dbname]
```

Replace the placeholders with your actual values from the Neon dashboard.