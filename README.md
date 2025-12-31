# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Firebase setup 🔧

This project can use Firebase for authentication and data storage (Firestore).

1. Create a Firebase project at https://console.firebase.google.com.
2. In the Firebase Console, enable **Authentication → Sign-in method → Email/Password**.
3. Create a Firestore database (test mode is fine for development).
4. Copy your Firebase config values and add them to `.env.local` (create it by copying `.env.example`).

Example `.env.local` (see `.env.example` added to the repo):

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id_optional
```

5. Start the dev server:

```bash
npm install
npm run dev
```

6. Create users:

- You can create users via the Firebase Console > Authentication > Add user.
- Or use the helper `createUser(email, password, role)` in `src/firebase/auth.js` in dev console or a temporary script to create a warden or student account. Example:

```js
import { createUser } from './src/firebase/auth';
createUser('warden@example.com', 'warden123', 'warden');
```

7. Login:

- Use the app root to choose a role and login with the email/password.

Troubleshooting

- Error "auth/configuration-not-found": this means your Firebase config values are missing in the environment. Create `.env.local` from `.env.example`, fill the VITE_FIREBASE_* values, then restart the dev server. Also ensure **Authentication → Sign-in method → Email/Password** is enabled in the Firebase Console.

---

