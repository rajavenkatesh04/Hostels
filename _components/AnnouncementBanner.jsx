// components/AnnouncementBanner.js
import { useState, useEffect } from 'react';
import { getActiveAnnouncements} from "@/lib/utils";

const AnnouncementBanner = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [dismissedAnnouncements, setDismissedAnnouncements] = useState([]);

    useEffect(() => {
        // Get active announcements when component mounts
        const activeAnnouncements = getActiveAnnouncements();
        setAnnouncements(activeAnnouncements);

        // Load dismissed announcements from localStorage
        const dismissed = JSON.parse(localStorage.getItem('dismissedAnnouncements') || '[]');
        setDismissedAnnouncements(dismissed);
    }, []);

    const dismissAnnouncement = (announcementId) => {
        // Add to dismissed list
        const newDismissed = [...dismissedAnnouncements, announcementId];
        setDismissedAnnouncements(newDismissed);

        // Save to localStorage so it stays dismissed even after refresh
        localStorage.setItem('dismissedAnnouncements', JSON.stringify(newDismissed));
    };

    // Filter out dismissed announcements
    const visibleAnnouncements = announcements.filter(
        announcement => !dismissedAnnouncements.includes(announcement.id)
    );

    if (visibleAnnouncements.length === 0) return null;

    return (
        <div className="space-y-2 m-6">
            {visibleAnnouncements.map((announcement) => (
                <div
                    key={announcement.id}
                    className={`relative p-4 rounded-lg border-l-4 ${
                        announcement.priority === 'high'
                            ? 'bg-red-100 border-red-400 text-red-800'
                            : 'bg-blue-50 border-blue-400 text-blue-800'
                    }`}
                >
                    {/* Close button */}
                    <button
                        onClick={() => dismissAnnouncement(announcement.id)}
                        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                        aria-label="Dismiss announcement"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
                        </svg>
                    </button>

                    {/* Announcement content */}
                    <div className="pr-8">
                        <h3 className="font-semibold text-lg mb-2">{announcement.title}</h3>
                        <p className="text-sm">{announcement.content}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AnnouncementBanner;