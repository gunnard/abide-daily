# Abide Daily

A cross-platform (iOS & Android) Christian mental wellness app for Scripture reflection, journaling, prayer, and spiritual habit tracking.

## Tech Stack
- React Native (Expo)
- TypeScript
- Firebase (Auth, Firestore, Storage, Analytics, Cloud Functions)
- Stripe (subscription billing)
- React Navigation
- ESLint, Prettier
- Dark/Light mode toggle

## Features
- Email/password & guest authentication
- Daily Scripture encouragement (365+ verses, multiple translations)
- Scripture-based journaling (prompts, mood tags, export)
- Audio devotionals & prayers
- Spiritual habit tracker (calendar, custom disciplines)
- Mood/reflection tracker
- Settings (theme, notifications, translation, subscription, account)
- Push notifications
- Firebase Analytics (feature usage only)
- Secure, private data (Firestore rules)

## Setup Instructions

1. **Clone the repo:**
   ```bash
   git clone <your-repo-url>
   cd abide-daily
   ```
2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```
3. **Configure Firebase:**
   - Create a Firebase project.
   - Add iOS/Android apps in Firebase console.
   - Copy your Firebase config to `src/config/firebase.ts`.
   - Set up Authentication (Email/Password, Anonymous), Firestore, Storage, Analytics.
   - Add Firestore security rules from `firebase.rules`.
4. **Configure Stripe:**
   - Create a Stripe account.
   - Set up products and pricing for subscriptions.
   - Add your Stripe keys to environment variables.
   - Configure Cloud Functions for subscription validation.
5. **Run the app:**
   ```bash
   npx expo start
   ```
6. **Environment variables:**
   - Copy `.env.example` to `.env` and fill in your keys.

## Scripts
- `npm run lint` – Lint code with ESLint
- `npm run format` – Format code with Prettier
- `npm run start` – Start Expo app

## Folder Structure
- `src/` – App source code
- `assets/` – Images, audio, fonts
- `firebase.rules` – Firestore security rules
- `scripture/` – Local JSON for daily verses

## License
MIT
