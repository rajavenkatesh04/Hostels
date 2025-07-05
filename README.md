# 🏠 Hostel Finder

A comprehensive web application designed to help students find their perfect hostel accommodation with advanced filtering, interactive mapping, and seamless navigation features.

## ✨ Features

### 🔍 Smart Hostel Discovery
- **Advanced Filtering System**: Filter hostels by amenities, room types, distance from university, and more
- **Personalized Matching**: Find hostels that match your specific preferences and requirements
- **Detailed Hostel Profiles**: View comprehensive information about each hostel including photos, amenities, and pricing and available configurations for that specific hostel.

### 🗺️ Interactive Map Integration
- **Real-time Hostel Markers**: All available hostels displayed as interactive markers on the map
- **Distance Calculator**: Instantly see how far each hostel is from UB(University Building)
- **Visual Location Context**: Get a clear understanding of hostel locations relative to campus and city landmarks

### 🧭 Navigation & Search
- **Dual Search Functionality**: Two specialized search bars for different search contexts
- **Route Planning**: Get detailed navigation routes from your current location to any of the markers on map.
- **Seamless User Experience**: Intuitive interface for effortless browsing and discovery

### 📚 Resources Hub
- **Document Center**: Access all required documents and forms for hostel applications
- **Hostel Guidelines**: Access links to mess timings etc
- **Important Information**: Essential details about hostel policies, code of conduct etc

### 🌙 Modern User Experience
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Fast Performance**: Built with modern web technologies for lightning-fast loading

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 with React
- **Styling**: Tailwind CSS for modern, responsive design
- **Database**: Supabase (PostgreSQL) for reliable data storage
- **Authentication**: Supabase Auth for secure user management
- **Maps**: Interactive mapping solution for location visualization using Google Maps JavaScript API
- **Deployment**: Optimized for modern hosting platform Vercel.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Supabase account and project setup

### Installation

1. Clone the repository
```bash
git clone https://github.com/rajavenkatesh04/Hostels.git
cd Hostels
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```

Add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

4. Run the development server
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📦 Project Structure

```
├── _components/           # Reusable UI components
├── app/                   # Next.js 14 app directory
│   ├── lib/               # Utility functions and configurations incl supabase client
│   └── pages/             # Application pages
├── public/                # Static assets
├── styles/                # Global styles and Tailwind config

```

## 🔧 Configuration

### Database Setup
The project uses Supabase for backend services. Key tables include:
- `hostels` - Hostel information and details
- `hostel_rooms ` - Hostel room configurations


### Map Integration
Configure your preferred mapping service (Google Maps, Mapbox, etc.) in the environment variables for full functionality.

## 📱 Features in Detail

### Filter System
- Gender, location, year of study based matching
- Amenity checkboxes (WiFi, AC, Laundry, etc.)
- Room type selection
- Distance from university

### Map Features
- Custom hostel icons
- Distance measurement tools
- Satellite/street view toggle
- Full-screen map mode

### Resources Page
- Terms and conditions
- Contact information for support
- Hostel rules
- Pricing structures
- Mess details
- Warden information

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Live Demo](https://hostel-livid.vercel.app)
- [Report Issues](https://github.com/rajavenkatesh04/Hostels/issues)

## 👥 Dev

Built with ❤️ by Raja, for students.

---

**Made for students seeking the perfect hostel experience** 🎓🏠
