// Seed data used the very first time the app runs in a browser.
// Everything here is written once into localStorage by services/storage.js
// and from then on the "database" lives in the browser.

export const REPORT_CATEGORIES = [
  'Facilities',
  'Safety',
  'Cleanliness',
  'Technology',
  'Accessibility',
  'Academic',
  'Transport',
  'Other',
];

export const REPORT_STATUSES = ['Submitted', 'Under Review', 'In Progress', 'Resolved'];

export const REPORT_PRIORITIES = ['Low', 'Medium', 'High'];

export const LOST_FOUND_CATEGORIES = ['Electronics', 'ID / Cards', 'Bags', 'Clothing', 'Books', 'Other'];

export const ANNOUNCEMENT_CATEGORIES = ['General', 'Events', 'Maintenance', 'Safety', 'Academic'];

export const seedUsers = [
  {
    id: 'student-demo-esha',
    role: 'student',
    universityId: 'cust',
    name: 'Esha Ahmed',
    studentId: 'SE-23-1042',
    email: 'esha.demo@cust.edu.pk',
    createdAt: '2026-08-01T09:00:00.000Z',
    status: 'Active',
  },
  {
    id: 'admin-demo-cust',
    role: 'admin',
    universityId: 'cust',
    name: 'CUST Administration',
    email: 'admin.demo@cust.edu.pk',
    createdAt: '2026-07-01T09:00:00.000Z',
    status: 'Active',
  },
];

const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
};

export const seedReports = [
  {
    id: 'UA-1042',
    universityId: 'cust',
    userId: 'student-demo-esha',
    title: 'Broken AC in Engineering Block',
    description:
      'The air conditioning unit in Lab 3 has been leaking and making a loud grinding noise for the past week. The room gets very hot during afternoon sessions.',
    category: 'Facilities',
    building: 'Engineering Block',
    location: 'Lab 3',
    status: 'In Progress',
    priority: 'Medium',
    isAnonymous: true,
    department: 'Facilities Management',
    internalNote: 'Maintenance has been notified and the issue is currently being investigated.',
    publicUpdate: 'Maintenance has been notified and the issue is currently being investigated.',
    createdAt: daysAgo(2),
    timeline: [
      { status: 'Submitted', date: daysAgo(2), note: 'Report submitted' },
      { status: 'Under Review', date: daysAgo(1.5), note: 'Reviewed by facilities team' },
      { status: 'In Progress', date: daysAgo(1), note: 'Maintenance has been notified and the issue is currently being investigated.' },
    ],
  },
  {
    id: 'UA-1038',
    universityId: 'cust',
    userId: 'student-demo-esha',
    title: 'Wi-Fi issue — Block A',
    description: 'Wi-Fi keeps disconnecting every few minutes in the Block A study area, especially in the evening.',
    category: 'Technology',
    building: 'Block A',
    location: 'Study Area, 2nd Floor',
    status: 'Under Review',
    priority: 'Low',
    isAnonymous: false,
    department: 'IT Services',
    internalNote: '',
    publicUpdate: '',
    createdAt: daysAgo(4),
    timeline: [
      { status: 'Submitted', date: daysAgo(4), note: 'Report submitted' },
      { status: 'Under Review', date: daysAgo(3), note: 'Reviewed by IT services' },
    ],
  },
  {
    id: 'UA-1029',
    universityId: 'cust',
    userId: 'student-demo-esha',
    title: 'Flickering lights near the library entrance',
    description: 'The overhead lights near the main library entrance flicker constantly after sunset. It also feels unsafe walking through at night.',
    category: 'Safety',
    building: 'Central Library',
    location: 'Main Entrance',
    status: 'Resolved',
    priority: 'High',
    isAnonymous: true,
    department: 'Facilities Management',
    internalNote: 'Electrician replaced the ballast on Sept 12.',
    publicUpdate: 'This has been fixed — the wiring was replaced on September 12.',
    createdAt: daysAgo(10),
    timeline: [
      { status: 'Submitted', date: daysAgo(10), note: 'Report submitted' },
      { status: 'Under Review', date: daysAgo(9), note: 'Reviewed by facilities team' },
      { status: 'In Progress', date: daysAgo(8), note: 'Electrician scheduled' },
      { status: 'Resolved', date: daysAgo(7), note: 'This has been fixed — the wiring was replaced on September 12.' },
    ],
  },
  {
    id: 'UA-1015',
    universityId: 'cust',
    userId: 'student-demo-esha',
    title: 'Cracked pavement outside Block C',
    description: 'A section of pavement outside Block C is cracked and uneven, and it becomes a trip hazard when it rains.',
    category: 'Accessibility',
    building: 'Block C',
    location: 'Main Walkway',
    status: 'Resolved',
    priority: 'Medium',
    isAnonymous: false,
    department: 'Facilities Management',
    internalNote: 'Resurfaced by contractor.',
    publicUpdate: 'The pavement has been resurfaced.',
    createdAt: daysAgo(16),
    timeline: [
      { status: 'Submitted', date: daysAgo(16), note: 'Report submitted' },
      { status: 'Under Review', date: daysAgo(15), note: 'Reviewed' },
      { status: 'In Progress', date: daysAgo(13), note: 'Contractor scheduled' },
      { status: 'Resolved', date: daysAgo(11), note: 'The pavement has been resurfaced.' },
    ],
  },
];

// Extra reports from "other students" so admin views feel populated.
export const seedOtherReports = [
  {
    id: 'UA-1041',
    universityId: 'cust',
    userId: 'student-other-1',
    title: 'Water cooler out of order — Cafeteria',
    description: 'The water cooler near the cafeteria entrance has not worked for three days.',
    category: 'Facilities',
    building: 'Student Center',
    location: 'Cafeteria',
    status: 'Submitted',
    priority: 'Low',
    isAnonymous: true,
    department: '',
    internalNote: '',
    publicUpdate: '',
    createdAt: daysAgo(1),
    timeline: [{ status: 'Submitted', date: daysAgo(1), note: 'Report submitted' }],
  },
  {
    id: 'UA-1036',
    universityId: 'cust',
    userId: 'student-other-2',
    title: 'Uncomfortable comments from a staff member',
    description: 'A staff member in the admin office has made repeated comments that made me uncomfortable. I would like this looked into quietly.',
    category: 'Safety',
    building: 'Admin Block',
    location: 'Front Office',
    status: 'Under Review',
    priority: 'High',
    isAnonymous: true,
    department: 'Student Affairs',
    internalNote: 'Escalated to Student Affairs for discreet follow-up.',
    publicUpdate: 'Your report has been escalated to Student Affairs for review.',
    createdAt: daysAgo(3),
    timeline: [
      { status: 'Submitted', date: daysAgo(3), note: 'Report submitted' },
      { status: 'Under Review', date: daysAgo(2), note: 'Escalated to Student Affairs for discreet follow-up.' },
    ],
  },
  {
    id: 'UA-1022',
    universityId: 'cust',
    userId: 'student-other-3',
    title: 'Projector not working — Room 204',
    description: 'The projector in Room 204 does not turn on. Classes have been using the whiteboard instead.',
    category: 'Technology',
    building: 'Academic Block',
    location: 'Room 204',
    status: 'In Progress',
    priority: 'Medium',
    isAnonymous: false,
    department: 'IT Services',
    internalNote: 'Replacement bulb ordered.',
    publicUpdate: 'A replacement bulb has been ordered and will be fitted this week.',
    createdAt: daysAgo(6),
    timeline: [
      { status: 'Submitted', date: daysAgo(6), note: 'Report submitted' },
      { status: 'Under Review', date: daysAgo(5), note: 'Reviewed by IT' },
      { status: 'In Progress', date: daysAgo(4), note: 'A replacement bulb has been ordered and will be fitted this week.' },
    ],
  },
];

export const seedLostFound = [
  {
    id: 'LF-2041',
    universityId: 'cust',
    userId: 'student-demo-esha',
    type: 'Found',
    title: 'Black Wallet',
    category: 'Bags',
    description: 'Found near the library reading room. Contains a student card and a small amount of cash.',
    location: 'Library',
    date: daysAgo(0),
    status: 'Open',
    createdAt: daysAgo(0),
  },
  {
    id: 'LF-2038',
    universityId: 'cust',
    userId: 'student-other-4',
    type: 'Lost',
    title: 'Blue Water Bottle',
    category: 'Other',
    description: 'Steel water bottle with a university sticker, lost somewhere around Block A.',
    location: 'Block A',
    date: daysAgo(1),
    status: 'Open',
    createdAt: daysAgo(1),
  },
  {
    id: 'LF-2030',
    universityId: 'cust',
    userId: 'student-other-5',
    type: 'Found',
    title: 'Wired Earphones',
    category: 'Electronics',
    description: 'White wired earphones found on a bench outside the cafeteria.',
    location: 'Cafeteria Courtyard',
    date: daysAgo(3),
    status: 'Open',
    createdAt: daysAgo(3),
  },
  {
    id: 'LF-2019',
    universityId: 'cust',
    userId: 'student-other-6',
    type: 'Lost',
    title: 'CUST Student Card — M. Bilal',
    category: 'ID / Cards',
    description: 'Lost my student card somewhere between the parking lot and Block C.',
    location: 'Parking Lot',
    date: daysAgo(5),
    status: 'Resolved',
    createdAt: daysAgo(5),
  },
  {
    id: 'LF-2012',
    universityId: 'cust',
    userId: 'student-other-7',
    type: 'Found',
    title: 'Calculus Textbook',
    category: 'Books',
    description: 'Found a calculus textbook with handwritten notes in Room 108.',
    location: 'Room 108',
    date: daysAgo(7),
    status: 'Open',
    createdAt: daysAgo(7),
  },
];

export const seedAnnouncements = [
  {
    id: 'AN-301',
    universityId: 'cust',
    title: 'Campus maintenance notice',
    category: 'Maintenance',
    description:
      'The Engineering Block water supply will be temporarily unavailable on Wednesday between 10 AM and 2 PM for scheduled pipe maintenance.',
    date: daysAgo(1),
    published: true,
  },
  {
    id: 'AN-298',
    universityId: 'cust',
    title: 'Mid-semester career fair',
    category: 'Events',
    description:
      'Over 20 companies will be on campus for the mid-semester career fair in the Student Center. Bring printed copies of your resume.',
    date: daysAgo(3),
    published: true,
  },
  {
    id: 'AN-291',
    universityId: 'cust',
    title: 'Updated evening shuttle schedule',
    category: 'General',
    description: 'The evening shuttle between the hostel and main campus now runs every 20 minutes until 10 PM.',
    date: daysAgo(6),
    published: true,
  },
  {
    id: 'AN-284',
    universityId: 'cust',
    title: 'Fire drill scheduled for Block C',
    category: 'Safety',
    description: 'A routine fire evacuation drill will take place in Block C. Please follow the instructions of floor wardens.',
    date: daysAgo(9),
    published: true,
  },
];

// Additional demo students for the admin "Students" table.
export const seedStudents = [
  { id: 'student-other-1', name: 'Hassan Raza', studentId: 'BSCS-22-014', universityId: 'cust', email: 'hassan.raza@cust.edu.pk', createdAt: daysAgo(200), status: 'Active' },
  { id: 'student-other-2', name: 'Anonymous Student', studentId: '—', universityId: 'cust', email: '—', createdAt: daysAgo(190), status: 'Active' },
  { id: 'student-other-3', name: 'Ayesha Tariq', studentId: 'SE-21-1098', universityId: 'cust', email: 'ayesha.tariq@cust.edu.pk', createdAt: daysAgo(400), status: 'Active' },
  { id: 'student-other-4', name: 'M. Bilal', studentId: 'EE-22-0087', universityId: 'cust', email: 'm.bilal@cust.edu.pk', createdAt: daysAgo(300), status: 'Active' },
  { id: 'student-other-5', name: 'Sara Khalid', studentId: 'SE-23-1101', universityId: 'cust', email: 'sara.khalid@cust.edu.pk', createdAt: daysAgo(60), status: 'Active' },
  { id: 'student-other-6', name: 'M. Bilal', studentId: 'EE-22-0087', universityId: 'cust', email: 'm.bilal@cust.edu.pk', createdAt: daysAgo(300), status: 'Active' },
  { id: 'student-other-7', name: 'Usman Farooq', studentId: 'CS-20-0456', universityId: 'cust', email: 'usman.farooq@cust.edu.pk', createdAt: daysAgo(500), status: 'Inactive' },
  { id: 'student-demo-esha', name: 'Esha Ahmed', studentId: 'SE-23-1042', universityId: 'cust', email: 'esha.demo@cust.edu.pk', createdAt: daysAgo(50), status: 'Active' },
];
