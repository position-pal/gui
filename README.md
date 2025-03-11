# Position Pal

GUI of the Position Pal application

## Environment

Required environment variables:

- `VITE_BACKEND_ENDPOINT`: The URL of the backend server. Default: `http://localhost:3000`
- `VITE_MAPBOX_API_KEY`: The API key for Mapbox.

They can be set in a `.env` file in the root of the project.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).


## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

### Firebase Configuration
Create a .env file in the root directory of your project with the following content:
```dotenv
VITE_FIREBASE_VAPID_KEY="..."
VITE_FIREBASE_API_KEY="..."
VITE_FIREBASE_AUTH_DOMAIN="..."
VITE_FIREBASE_PROJECT_ID="..."
VITE_FIREBASE_STORAGE_BUCKET="..."
VITE_FIREBASE_MESSAGING_SENDER_ID="..."
VITE_FIREBASE_APP_ID="..."
```

