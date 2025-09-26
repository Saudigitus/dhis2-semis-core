import resultImage from "../../../assets/images/home/result.png";
import transferImage from "../../../assets/images/home/transfer.png";
import enrollmentImage from "../../../assets/images/home/enrollment.png";
import attendanceImage from "../../../assets/images/home/attendance.png";
import performanceImage from "../../../assets/images/home/performance.png";
import schoolCallendar from "../../../assets/images/home/callendar.svg";
import settings from "../../../assets/images/home/settings.svg";

const studentCards = [
    { label: "Enrollment", id: "registration", icon: enrollmentImage, path: "enrollments" },
    { label: "Attendance", id: "attendance", icon: attendanceImage, path: "attendance" },
    { label: "Performance", id: "performance", icon: performanceImage, path: "performance" },
    { label: "Transfer", id: "transfer", icon: transferImage, path: "transfer" },
    { label: "Final Result", id: "final-result", icon: resultImage, path: "final-result" },
];

const staffCards = [
    { label: "Staff registry", id: "registration", icon: enrollmentImage, path: "enrollments" },
    { label: "Attendance", id: "attendance", icon: attendanceImage, path: "attendance" },
    { label: "Transfer", id: "transfer", icon: transferImage, path: "transfer" },
    { label: "Re-enroll", id: "reenroll", icon: resultImage, path: "re-enroll" },
];

const configurations = [
    { label: "Configurations", icon: settings, path: "configuration" },
    { label: "School calendar", icon: schoolCallendar, path: "school-calendar", id: "school-calendar" }
];

const dashboardData = [
    { key: 0, title: "Student", subItems: studentCards },
    { key: 1, title: "Staff", subItems: staffCards },
    { key: 2, title: "Configurations", subItems: configurations }
]

export { staffCards, studentCards, dashboardData }