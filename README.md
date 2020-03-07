# Suplmntl

A lightweight list making, sharing, and annotation tool.

Made with NodeJS + MongoDB on the backend and a React + Redux SPA on the frontend.

## Running it yourself

With a mongodb instance running, fill out the following properties in a file named `.env`

```
PORT=8000
TOKEN_SECRET='something secure and secret'

# optional, only if you want to test email stuff
MAILGUN_API_KEY='another long secure string'
MAILGUN_DOMAIN='somethingsomething.mailgun.org'

# optional, if true the server will log database queries
MONGO_DEBUG="false"
```

Then run:

```
npm install
npm run start
```

That's it.

## To Do

There are a lot of other tweaks and features I would like to add. Below is a short list of them:

- Server side rendering for social (Twitter, FB) cards
- Video annotation
- Folders
- Collection pagination
- Archive action

## License

MIT