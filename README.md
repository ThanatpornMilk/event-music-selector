# Event Music Selector

A Next.js web application designed to help you quickly generate, preview, and curate music playlists tailored for various events and themes. Whether it's a Wedding, Birthday Party, or a specific vibe, the Event Music Selector intelligently fetches the right songs to set the mood.

## 🚀 Features

- **Event-Based Playlist Generation:** Select specific themes (e.g., Wedding, Night Party, Halloween), music genres, and languages to generate curated playlists automatically.
- **YouTube Previews:** Each song in the generated playlist features a lazy-loaded YouTube thumbnail and an embedded player for instant previewing.
- **Save to Favorites:** Found a perfect mix? Save the generated playlist to your personal collection.
- **Customizable Collections:**
  - Rename your saved playlists.
  - Remove specific tracks that don't fit your vibe.
  - Move/Transfer songs between your different saved playlists.
- **Modern Responsive UI:** Built with Tailwind CSS, ensuring a seamless experience across mobile, tablet, and desktop screens. It includes accessible custom dropdowns and smooth modals.

## 🛠️ Technology Stack

- **Framework:** Next.js (React)
- **Styling:** Tailwind CSS (v4)
- **Database:** SQLite (via `better-sqlite3`)
- **ORM:** Prisma
- **Icons & Modals:** `react-icons`, `react-modal`
- **Data Parsing:** `csv-parse`, `papaparse`

## 📦 Installation & Setup

1. **Clone the repository** (if applicable) or navigate to the project directory:
   ```bash
   cd event-music-selector
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory. Configure your Prisma database URL to point to your SQLite file:
   ```env
   DATABASE_URL="file:./dev.db"
   ```

4. **Initialize the Database:**
   Deploy the Prisma schema to create your SQLite database file:
   ```bash
   npx prisma db push
   ```

5. **Seed the Database (Optional but recommended):**
   If you have a seed script to populate songs, genres, and themes from a CSV:
   ```bash
   node scripts/seed.js
   ```

6. **Start the development server:**
   ```bash
   npm run dev
   ```

7. **Open the app:**
   Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## 📁 Project Structure

- `/src/app/`: Next.js App Router pages (e.g., Home, `/playlist`, `/favorite`).
- `/src/components/`: Reusable React components (`Selector.js`, UI Modals, Cards).
- `/src/actions/`: Server actions to interface with Prisma for fetching and mutating data.
- `/src/lib/`: Library configurations (e.g., Prisma client instantiation).
- `/scripts/`: Scripts for database seeding/data manipulation.
- `/prisma/`: Prisma schema definition.

## 📝 Usage Flow

1. Go to the Home Page and set your criteria: **Theme**, **Languages**, and **Genres**.
2. Click **Create Playlists**. The app will shuffle matching songs and generate 5 distinct playlists.
3. You'll be redirected to the **Generated Playlists** page. Here you can browse the tracks and preview them.
4. Click the **Heart (Favorite)** icon to save a playlist. You'll be prompted to give it a custom name.
5. Navigate to the **Favorites** page to manage all your saved collections.

## ⚖️ License

This project is created for private/internal usage. Ensure you have the rights to the YouTube URLs and music references used within the application.
