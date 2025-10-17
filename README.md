## developing

### requirements

- node.js
- any manga of choice named test.pdf in /public
- poppler (ensure bin is in path)

### installing and running

how to start working on the project:

1. git clone https://github.com/MangoPanel/website.git

2. install dependencies with: `npm install`

3. start server with: `npm run dev`

4. open [http://localhost:3000](http://localhost:3000)

### contributing

Commit to your own branch.
```bash
git checkout -b first-name
```
or if the branch already exists
```bash
git checkout first-name
```

Once it's decided we're ready to merge, from main:
```bash
git merge first-name
```

After your repository was pushed, you're ready to update your branch to main
```bash
git pull origin main
```