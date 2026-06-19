# Ganpati Mandal Locator

A web application to find and locate Ganpati mandals with an interactive map interface and admin management system.

## Features

- 🗺️ **Interactive Map** - Leaflet.js powered map showing all mandal locations
- 🔍 **Search Functionality** - Search mandals by name, address, or area
- ⏰ **Arti Timings** - View morning, afternoon, and evening arti times for each mandal
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
- 🔐 **Admin Panel** - Password-protected admin dashboard to add, edit, and delete mandals
- 💾 **SQLite Database** - Lightweight, file-based database
- ⚡ **Fast API** - Express.js backend with RESTful endpoints

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript, Leaflet.js
- **Backend**: Node.js, Express.js
- **Database**: SQLite3

## Installation

1. Install dependencies:
```bash
npm install
```

## Running the Application

Start the server:
```bash
npm start
```

The application will be available at:
- **Locator**: `http://localhost:3000`
- **Admin Panel**: `http://localhost:3000/admin.html`

## Admin Panel

### Login
- Default admin password: `admin123` (change in production by modifying server.js)
- Access via the ⚙️ button on the map or directly at `/admin.html`

### Features
- **Add Mandals** - Add new Ganpati mandals with location and details
- **Edit Mandals** - Update existing mandal information
- **Delete Mandals** - Remove mandals from the database
- **Set Arti Times** - Configure morning, afternoon, and evening arti timings
- **Search** - Quick search through existing mandals

## API Endpoints

### Public Endpoints
- `GET /api/mandals` - Get all mandals
- `GET /api/mandals/search?q=query` - Search mandals by name, address, or area
- `GET /api/mandals/:id` - Get a specific mandal by ID

### Admin Endpoints (Require Password)
- `POST /api/mandals` - Add a new mandal
  ```json
  {
    "password": "admin123",
    "name": "Mandal Name",
    "address": "Address",
    "latitude": 19.0176,
    "longitude": 72.8479,
    "contact": "9876543210",
    "area": "Central Mumbai",
    "morning_arti": "06:00 AM",
    "afternoon_arti": "01:30 PM",
    "evening_arti": "08:00 PM"
  }
  ```
- `PUT /api/mandals/:id` - Update a mandal (same payload structure)
- `DELETE /api/mandals/:id` - Delete a mandal

## Project Structure

```
ganpati-mandal-locator/
├── server.js           # Express server and API
├── index.html          # Frontend - Mandal locator
├── admin.html          # Admin panel for management
├── package.json        # Project dependencies
├── mandals.db          # SQLite database (auto-created)
└── README.md          # This file
```

## Sample Data

The application comes with 15 sample Ganpati mandals in Mumbai with:
- Mandal names and addresses
- Contact information
- Geographic coordinates (latitude/longitude)
- Area information
- Morning, afternoon, and evening arti times

## Mandal Details

Each mandal record includes:
- **Name** - Mandal name
- **Address** - Physical location/address
- **Contact** - Phone number
- **Area** - Geographic area/zone
- **Coordinates** - Latitude and longitude for map display
- **Arti Timings** - Three daily prayer times (Morning, Afternoon, Evening)

## Features in Detail

### Search & Locator
- Real-time search by mandal name, address, or area
- Search results update both the sidebar list and map markers
- Click any mandal to zoom in and view details
- Click map markers to see quick info popups

### Map
- OpenStreetMap tiles (free, no API key needed)
- Interactive markers for all mandals
- Popups showing mandal details
- Smooth zoom and pan controls

### Admin Dashboard
- Clean, intuitive interface
- Add mandals with full details including arti timings
- Edit any existing mandal information
- Delete mandals with confirmation
- Search mandals quickly in the admin list
- Time picker for easy arti time entry

### Responsive Design
- **Desktop**: Sidebar on left, map on right
- **Mobile**: Stacked layout with search on top
- Touch-friendly interface

## Security Notes

- Default admin password is `admin123` - **Change this in production!**
- Modify the `ADMIN_PASSWORD` variable in `server.js`
- Use environment variables for production secrets
- Consider adding HTTPS when deploying online
- Implement proper authentication (JWT, OAuth) for production use

## Future Enhancements

- User authentication system
- Photo gallery for mandals
- Review and rating system
- Festive schedules and special events
- Visitor count tracker
- Donation/contribution options
- Social media integration
- Distance calculation from user location
- Multi-language support (Marathi, Hindi)
"# GANPATI-MANDAL-LOCATOR" 
