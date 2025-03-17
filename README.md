# Position Pal

Graphical User Interface of the Position Pal application.

## Pre-requisites

In order for the service to function properly, the following environment variables must be set and available at startup.
They can be set in a `.env` file in the root of the project.

| Variable Name                       | Description                                                      |
|-------------------------------------|------------------------------------------------------------------|
| `VITE_BACKEND_ENDPOINT`             | The URL of the backend server. Default: `http://localhost:3000`. |
| `VITE_MAPBOX_API_KEY`               | The API key for Mapbox.                                          |
| `VITE_FIREBASE_VAPID_KEY`           | The Firebase VAPID key.                                          |
| `VITE_FIREBASE_API_KEY`             | The Firebase API key.                                            |
| `VITE_FIREBASE_AUTH_DOMAIN`         | The Firebase auth domain.                                        |
| `VITE_FIREBASE_PROJECT_ID`          | The Firebase project ID.                                         |
| `VITE_FIREBASE_STORAGE_BUCKET`      | The Firebase storage bucket.                                     |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | The Firebase Cloud Messaging sender ID.                          |
| `VITE_FIREBASE_APP_ID`              | The Firebase app ID.                                             |

## Documentation

Refer to the [project documentation](https://position-pal.github.io/docs/) for more details on the project.
