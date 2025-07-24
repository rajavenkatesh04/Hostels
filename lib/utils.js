// utils/announcements.js
export const announcements = [
    {
        id: 1,
        title: "Physical Enrollment Session",
        content: "Physical enrollment session for first year students will be conducted from July 24th to August 8th. Please ensure all required documents are ready.",
        startDate: "2025-07-24",
        endDate: "2025-08-08",
        priority: "high", // This helps with styling - high priority could be red/urgent
        isActive: true
    }
];

// Function to check if announcement should be displayed
export const getActiveAnnouncements = () => {
    const today = new Date();
    const currentDate = today.toISOString().split('T')[0]; // Gets YYYY-MM-DD format

    return announcements.filter(announcement => {
        const startDate = announcement.startDate;
        const endDate = announcement.endDate;

        // Check if current date falls within the announcement period
        return announcement.isActive &&
            currentDate >= startDate &&
            currentDate <= endDate;
    });
};