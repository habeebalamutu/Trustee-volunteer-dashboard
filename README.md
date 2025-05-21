# Volunteer Dashboard

A modern, responsive React application for discovering, filtering, and managing volunteer opportunities. Users can search, filter by category, add new opportunities, and manage their profile with image upload. Only opportunities added by the current user can be edited or deleted.

## Features
- List volunteer opportunities as professional, animated cards
- Live search by title or organization
- Category dropdown filter with color/emoji
- Add new opportunity (form with validation)
- Edit/delete only your own added opportunities
- Opportunity details modal (description, duration, skills, contact)
- Profile page: edit name, email, role, and upload avatar (persisted to localStorage)
- Responsive, mobile-friendly UI with animated hamburger menu navigation
- Toast/snackbar alerts for all actions
- Loading spinner while fetching data

## Tech Stack
- React (TypeScript)
- CSS (custom, responsive, animated)
- Fetch API (mocked with local JSON file)

## Setup & Run
1. **Clone the repo:**
   ```sh
   git clone <your-repo-url>
   cd trustesse-volunteer-dashboard
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Start the app:**
   ```sh
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## File Structure
- `public/opportunities.json` — Mock data for opportunities
- `src/App.tsx` — Main app logic and navigation
- `src/pages/AddOpportunity.tsx` — Add opportunity form
- `src/pages/Profile.tsx` — Profile management
- `src/components/OpportunityCard.tsx` — Card UI for opportunities
- `src/types.ts` — TypeScript types



## Contact
**Author:** Habeeb Alamutu

- Email: Habeebalamutu04@gmail.com
- GitHub: https://github.com/habeebalamutu

---
Feel free to fork, use, and improve this project!
