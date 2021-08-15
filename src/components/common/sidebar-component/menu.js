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
const roleId = localStorage.getItem('roleId');
export const MENUITEMS = 
(roleId==4)?
[
    {
        title: 'Dashboard', icon: Bookmark, type: 'link', path: '/dashboard', active: false, bookmark: true
    }, 
    {
        title: 'Payments', icon: DollarSign, type: 'sub', active: false, children: [
            { path: '/payment/generate-invoices', title: 'Generated Invoices', type: 'link' },
            { path: '/payment/invoiceType', title: 'Invoice Type', type: 'link' },
            { path: '/payment/receipt', title: 'Receipt', type: 'link' },
        ]
    },
    {
        title: 'Communication', icon: Mail, type: 'sub', active: false, children: [
            { path: '/communication/sms', title: 'SMS', type: 'link' },
            { path: '/communication/email', title: 'Email', type: 'link' },
            { path: '/communication/template', title: 'Template', type: 'link' },
        ]
    },
    {
        title: 'Class settings',  icon: Settings, type: 'sub', active: false, children: [
            { path: '/enroll-management', title: 'Enroll Management', type: 'link' }
        ]
    },
    {
        title: 'Institute Settings', icon: Settings, type: 'sub', active: false, children: [
            // { path: '/institute/role-management', title: 'Role Management', type: 'link' },
            { path: '/user-management', title: 'User Management', type: 'link' },
            { path: '/class-management', title: 'Class Management', type: 'link' },
            { path: '/subject-management', title: 'Subject Management', type: 'link' },
            { path: '/academic-year-management', title: 'Academic Management', type: 'link' },
            { path: '/term-management', title: 'Term Management', type: 'link' },
        ]
    }    
]:(roleId==2)?
[
    {
        title: 'Dashboard', icon: Bookmark, type: 'link', path: '/dashboard', active: false, bookmark: true
    }, 
    {
        title: 'Class Room', icon: BookOpen, type: 'sub', active: false, children: [
            { path: '/class-room-overview', title: 'Class Room Overview', type: 'link' },
            { path: '/subjects', title: 'Text Book', type: 'link' },
            { path: '/students-attendant', title: 'Student Attendance', type: 'link' },
            { path: '/timetable', title: 'Time Table', type: 'link' }
        ]
    },
    {
        title: 'Library', icon: Book, type: 'link', path: '/library', active: false, bookmark: true
    },
    {
        title: 'Calendar', icon: Calendar, type: 'link', path: '/calendar', active: false, bookmark: true,children: [
            { path: '/event-management', title: 'Event Management', type: 'link' }
        ]
    },  
    {
        title: 'Support Ticket', icon: HelpCircle, type: 'sub', active: false, children: [
            { path: '/support/new-ticket', title: 'New Ticket', type: 'link' },
            { path: '/support/my-ticket', title: 'My Ticket', type: 'link' },
            { path: '/support/users-tickets', title: 'User Ticket', type: 'link' },
        ]
    },
    {
        title: 'Incident Report', icon: Paperclip, type: 'link', path: '/incident-report', active: false, bookmark: true
    },
    {
        title: 'Communication', icon: Mail, type: 'sub', active: false, children: [
            { path: '/communication/sms', title: 'SMS', type: 'link' },
            { path: '/communication/email', title: 'Email', type: 'link' },
        ]
    },  
    {
        title: 'Class settings',  icon: Settings, type: 'sub', active: false, children: [
            { path: '/chapter-management', title: 'Chapter Management', type: 'link' },
        ]
    },
]
:(roleId==1)?
[
    {
        title: 'Dashboard', icon: Bookmark, type: 'link', path: '/dashboard', active: false, bookmark: true
    },    
    {
        title: 'Class Room', icon: BookOpen, type: 'sub', active: false, children: [
            { path: '/class-room-overview', title: 'Class Room Overview', type: 'link' },
            { path: '/subjects', title: 'Text Book', type: 'link' },
            { path: '/timetable', title: 'Time Table', type: 'link' },
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
        ]
    },
    {
        title: 'Communication', icon: Mail, type: 'sub', active: false, children: [
            { path: '/communication/email', title: 'Email', type: 'link' }
        ]
    } 
]:(roleId==3)?
[
    {
        title: 'Dashboard', icon: Bookmark, type: 'link', path: '/dashboard', active: false, bookmark: true
    }, 
    {
        title: 'Class Room', icon: BookOpen, type: 'sub', active: false, children: [
            { path: '/class-room-overview', title: 'Class Room Overview', type: 'link' },
            { path: '/subjects', title: 'Text Book', type: 'link' },
            { path: '/student-attendant', title: 'Student Attendance', type: 'link' },
            { path: '/timetable', title: 'Time Table', type: 'link' }
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
            { path: '/support/my-ticket', title: 'My Ticket', type: 'link' }
        ]
    },
    {
        title: 'Incident Report', icon: Paperclip, type: 'link', path: '/incident-report', active: false, bookmark: true
    },
    {
        title: 'Payments', icon: DollarSign, type: 'sub', active: false, children: [
            { path: '/payment/invoices', title: 'Invoices', type: 'link' },
            { path: '/payment/receipt', title: 'Receipt', type: 'link' },
        ]
    },
    {
        title: 'Communication', icon: Mail, type: 'sub', active: false, children: [
            { path: '/communication/email', title: 'Email', type: 'link' },
        ]
    } 
]:[]