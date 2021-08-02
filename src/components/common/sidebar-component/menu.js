import {
    DollarSign,
    Settings,
    Bookmark,
    BookOpen,
    Paperclip,
    Book,
    Calendar,
    Mail,
    UserCheck,
    HelpCircle
} from 'react-feather';

export const MENUITEMS = [
    {
        title: 'Dashboard', icon: Bookmark, type: 'link', path: '/dashboard', active: false, bookmark: true
    },
    {
        title: 'Dashboard', icon: Bookmark, type: 'link', path: '/sysdashboard', active: false, bookmark: true
    },
    {
        title: 'System Security', icon: Settings, type: 'sub', active: false, children: [
            // { path: '/system/role-management', title: 'Role Management', type: 'link' },
            { path: '/system/user-management', title: 'User Management', type: 'link' },
            { path: '/system/institute-management', title: 'Institute Management', type: 'link' },
            // { path: '/system/package-management', title: 'Package Management', type: 'link' },
            // { path: '/system/user-activity-log', title: 'User Activity log', type: 'link' },
        ]
    },
    {
        title: 'Institute Setting', icon: Settings, type: 'sub', active: false, children: [
            // { path: '/institute/role-management', title: 'Role Management', type: 'link' },
            { path: '/institute/user-management', title: 'User Management', type: 'link' },
            { path: '/institute/class-management', title: 'Class Management', type: 'link' },
            { path: '/institute/subject-management', title: 'Subject Management', type: 'link' },
            { path: '/institute/academic-year-management', title: 'Academic Management', type: 'link' },
            { path: '/institute/term-management', title: 'Term Management', type: 'link' },
        ]
    },
    {
        title: 'Class Setting', icon: Settings, type: 'sub', active: false, children: [
            { path: '/class/student-management', title: 'Student Management', type: 'link' },
            { path: '/class/time-table', title: 'Time Table', type: 'link' },
            { path: '/class/capter-management', title: 'Capter Management', type: 'link' },
        ]
    },
    {
        title: 'Class Room', icon: BookOpen, type: 'sub', active: false, children: [
            { path: '/class-room-overview', title: 'Class Room Overview', type: 'link' },
            { path: '/subjects', title: 'Text Book', type: 'link' },
            { path: '/student-attendant', title: 'Student Attendant', type: 'link' },
        ]
    },
    {
        title: 'Library', icon: Book, type: 'link', path: '/library', active: false, bookmark: true
    },
    {
        title: 'Calendar', icon: Calendar, type: 'link', path: '/calendar', active: false, bookmark: true
    },
    {
        title: 'Support Ticket', icon: HelpCircle, type: 'sub', active: false, children: [
            { path: '/support/new-ticket', title: 'New Ticket', type: 'link' },
            { path: '/support/my-ticket', title: 'My Ticket', type: 'link' },
            { path: '/support/users-tickets', title: 'Users Tickets', type: 'link' },
        ]
    },
    {
        title: 'Incident Report', icon: Paperclip, type: 'link', path: '/incident-report', active: false, bookmark: true
    },
    {
        title: 'Payment', icon: DollarSign, type: 'sub', active: false, children: [
            { path: '/payment/invoice', title: 'Invoice', type: 'link' },
            { path: '/payment/receipt', title: 'Receipt', type: 'link' },
        ]
    },
    {
        title: 'Communication', icon: Mail, type: 'sub', active: false, children: [
            { path: '/Communication/sms', title: 'Sms', type: 'link' },
            { path: '/Communication/email', title: 'Email', type: 'link' },
            { path: '/Communication/template', title: 'Template', type: 'link' },
        ]
    }
]
