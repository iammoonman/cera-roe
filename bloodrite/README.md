# BLOODRITE

Powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

This is the website.

## Developing

Once you've created a project and installed dependencies with `npm install`, start a development server with `npm run dev`.

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

## .env

This project needs several string environment variables.  
`TOKEN` is a Discord bot token.  
`SECRET` is a Discord OAuth2 client secret.  
`GUILD` is the Discord guild ID from Limited Perspective.  
`CLIENT` is the Discord bot's user ID.  
`MONGO` is the connection string for the Mongo Atlas instance. If you don't have this, some dummy data will be loaded.  
`AUTH_SECRET` is the encryption string for the authentication.  
There are also some KV variables for the Vercel KV store.
