![logo](public/logo.png)

> [!NOTE]
> This is a student project, as of current it is not hosted

## requirements

- node.js
- mangopanel/core (for the translate and redo features)

### installing and running

how to start working on the project:

1. git clone https://github.com/MangoPanel/website.git

2. install dependencies with: `npm install`

3. Create an .env.local file containing DATABASE_URL, PGSSLMODE, NODE_ENV, R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME and R2_PUBLIC_URL

### contributing

Commit to your own branch.
```bash
git checkout -b first-name
```
or if the branch already exists
```bash
git checkout first-name
```

As of current, we pull request directly to main

After your repository was merged, remember to update your branch with
```bash
git pull origin main
```