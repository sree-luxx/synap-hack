# SynapHack 3.0 – Event & Hackathon Hosting Platform  

## 📌 Overview  
SynapHack 3.0 is a modern, scalable **event and hackathon hosting platform** designed for student-led and community-driven initiatives.  
The platform provides smooth workflows for **organizers, participants, and judges**, with real-time engagement, automated certificates, leaderboards, and analytics.  

---

## 🚀 Tech Stack  

### Frontend (synaphack-frontend)  
- **Framework:** React 18 + TypeScript  
- **Build Tool:** Vite  
- **Routing:** React Router DOM  
- **UI/UX:** Tailwind CSS, Framer Motion, lucide-react  
- **State Management:** React Context API (Auth, Notifications)  
- **Realtime:** socket.io-client + Pusher integration  

### Backend (backend)  
- **Framework:** Next.js 14 (API routes in `/pages/api`)  
- **Authentication:** NextAuth.js (Google, GitHub, Credentials) + Prisma Adapter  
- **Databases:**  
  - **Azure SQL (via Prisma):** Users, Events, Teams, Registrations, Judge Assignments  
  - **MongoDB (via Mongoose):** Q&A, Announcements, Unstructured data  
- **Realtime:** Pusher SDK (announcements, leaderboard, chat)  
- **Utilities:** bcryptjs, JWT, pdfkit (certificates), formidable (uploads), Azure Blob Storage  

### Deployment  
- **Cloud:** Azure Web Apps + Azure Blob Storage  
- **Databases:** Azure SQL + MongoDB Atlas  

---

## 📂 Project Structure  

