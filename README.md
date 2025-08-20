# SynapHack 3.0 – Event & Hackathon Hosting Platform  

## Overview  
SynapHack 3.0 is a modern, scalable **event and hackathon hosting platform** designed for student-led and community-driven initiatives.  
The platform provides smooth workflows for **organizers, participants, and judges**, with real-time engagement, automated certificates, leaderboards, and analytics.  
--

## Tech Stack  

### Frontend (synaphack-frontend)  
- React 18 + TypeScript  
- Vite (build tool)  
- React Router DOM (routing)  
- Tailwind CSS, Framer Motion, lucide-react (UI/UX)  
- React Context API (Auth, Notifications)  
- socket.io-client + Pusher (realtime communication)  

### Backend (backend)  
- Next.js 14 (API routes in `/pages/api`)  
- NextAuth.js (Google, GitHub, Credentials) + Prisma Adapter (authentication)  
- Prisma (Azure SQL) for structured data  
- Mongoose (MongoDB) for Q&A and unstructured content  
- Pusher SDK (realtime channels)  
- Utilities: bcryptjs, JWT, pdfkit (certificates), formidable (uploads), Azure Blob Storage  

### Deployment  
- Azure Web Apps + Azure Blob Storage  
- Azure SQL Database + MongoDB Atlas  




