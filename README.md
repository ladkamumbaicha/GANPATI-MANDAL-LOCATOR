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


## Future Enhancements
- Photo gallery for mandals
- Review and rating system
- Festive schedules and special events
- Visitor count tracker
- Donation/contribution options
- Social media integration
- Distance calculation from user location
- Multi-language support (Marathi, Hindi)