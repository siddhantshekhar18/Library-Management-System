const today = new Date();
const fmt = (d) => d.toISOString().split('T')[0];
const past = (days) => { const d = new Date(today); d.setDate(d.getDate() - days); return fmt(d); };
const future = (days) => { const d = new Date(today); d.setDate(d.getDate() + days); return fmt(d); };

export const FINE_PER_DAY = 5;

export const CATEGORIES = ['Science', 'Economics', 'Fiction', 'Children', 'Personal Development'];

export const CATEGORY_CODES = {
  Science: 'SC',
  Economics: 'EC',
  Fiction: 'FC',
  Children: 'CH',
  'Personal Development': 'PD',
};

export const initialUsers = [
  { id: 'adm', password: 'adm', name: 'Administrator', role: 'admin', status: 'active' },
  { id: 'user', password: 'user', name: 'Library User', role: 'user', status: 'active' },
];

export const initialItems = [
  // Science Books
  { serialNo: 'SCB000001', name: 'Introduction to Physics', author: 'Isaac Newton', category: 'Science', type: 'Book', status: 'Available', cost: 350, procurementDate: '2023-01-15' },
  { serialNo: 'SCB000002', name: 'Chemistry Basics', author: 'Marie Curie', category: 'Science', type: 'Book', status: 'Available', cost: 425, procurementDate: '2023-02-20' },
  { serialNo: 'SCB000003', name: 'Biology 101', author: 'Charles Darwin', category: 'Science', type: 'Book', status: 'Available', cost: 380, procurementDate: '2023-03-10' },
  { serialNo: 'SCB000004', name: 'Advanced Mathematics', author: 'Albert Einstein', category: 'Science', type: 'Book', status: 'Issued', cost: 500, procurementDate: '2023-01-05' },
  // Economics Books
  { serialNo: 'ECB000001', name: 'Principles of Economics', author: 'Adam Smith', category: 'Economics', type: 'Book', status: 'Available', cost: 450, procurementDate: '2023-04-12' },
  { serialNo: 'ECB000002', name: 'Microeconomics', author: 'John Keynes', category: 'Economics', type: 'Book', status: 'Available', cost: 395, procurementDate: '2023-05-08' },
  { serialNo: 'ECB000003', name: 'Global Trade', author: 'Paul Krugman', category: 'Economics', type: 'Book', status: 'Available', cost: 420, procurementDate: '2023-06-15' },
  { serialNo: 'ECB000004', name: 'Investment Basics', author: 'Warren Buffett', category: 'Economics', type: 'Book', status: 'Available', cost: 480, procurementDate: '2023-07-20' },
  // Fiction Books
  { serialNo: 'FCB000001', name: 'The Great Adventure', author: 'Mark Twain', category: 'Fiction', type: 'Book', status: 'Available', cost: 250, procurementDate: '2023-08-10' },
  { serialNo: 'FCB000002', name: 'Mystery Island', author: 'Agatha Christie', category: 'Fiction', type: 'Book', status: 'Issued', cost: 280, procurementDate: '2023-09-05' },
  { serialNo: 'FCB000003', name: 'The Lost World', author: 'Arthur Conan Doyle', category: 'Fiction', type: 'Book', status: 'Available', cost: 265, procurementDate: '2023-10-12' },
  { serialNo: 'FCB000004', name: 'Pride and Prejudice', author: 'Jane Austen', category: 'Fiction', type: 'Book', status: 'Available', cost: 220, procurementDate: '2023-11-18' },
  // Children Books
  { serialNo: 'CHB000001', name: 'Fairy Tales Collection', author: 'Hans Andersen', category: 'Children', type: 'Book', status: 'Available', cost: 180, procurementDate: '2023-12-01' },
  { serialNo: 'CHB000002', name: 'The Jungle Book', author: 'Rudyard Kipling', category: 'Children', type: 'Book', status: 'Available', cost: 195, procurementDate: '2024-01-10' },
  { serialNo: 'CHB000003', name: 'Alice in Wonderland', author: 'Lewis Carroll', category: 'Children', type: 'Book', status: 'Available', cost: 165, procurementDate: '2024-02-15' },
  { serialNo: 'CHB000004', name: "Gulliver's Travels", author: 'Jonathan Swift', category: 'Children', type: 'Book', status: 'Available', cost: 175, procurementDate: '2024-03-20' },
  // Personal Development Books
  { serialNo: 'PDB000001', name: 'Think and Grow Rich', author: 'Napoleon Hill', category: 'Personal Development', type: 'Book', status: 'Available', cost: 320, procurementDate: '2024-04-05' },
  { serialNo: 'PDB000002', name: 'The 7 Habits', author: 'Stephen Covey', category: 'Personal Development', type: 'Book', status: 'Available', cost: 350, procurementDate: '2024-05-10' },
  { serialNo: 'PDB000003', name: 'Atomic Habits', author: 'James Clear', category: 'Personal Development', type: 'Book', status: 'Available', cost: 380, procurementDate: '2024-06-15' },
  { serialNo: 'PDB000004', name: 'The Power of Now', author: 'Eckhart Tolle', category: 'Personal Development', type: 'Book', status: 'Available', cost: 295, procurementDate: '2024-07-20' },
  // Science Movies
  { serialNo: 'SCM000001', name: 'The Universe', author: 'Carl Sagan', category: 'Science', type: 'Movie', status: 'Available', cost: 150, procurementDate: '2023-01-20' },
  { serialNo: 'SCM000002', name: 'Interstellar', author: 'Christopher Nolan', category: 'Science', type: 'Movie', status: 'Available', cost: 200, procurementDate: '2023-02-25' },
  { serialNo: 'SCM000003', name: 'A Beautiful Mind', author: 'Ron Howard', category: 'Science', type: 'Movie', status: 'Available', cost: 175, procurementDate: '2023-03-15' },
  { serialNo: 'SCM000004', name: 'The Imitation Game', author: 'Morten Tyldum', category: 'Science', type: 'Movie', status: 'Available', cost: 185, procurementDate: '2023-04-10' },
  // Economics Movies
  { serialNo: 'ECM000001', name: 'The Big Short', author: 'Adam McKay', category: 'Economics', type: 'Movie', status: 'Available', cost: 160, procurementDate: '2023-05-12' },
  { serialNo: 'ECM000002', name: 'Wall Street', author: 'Oliver Stone', category: 'Economics', type: 'Movie', status: 'Available', cost: 155, procurementDate: '2023-06-18' },
  { serialNo: 'ECM000003', name: 'The Wolf of Wall Street', author: 'Martin Scorsese', category: 'Economics', type: 'Movie', status: 'Issued', cost: 170, procurementDate: '2023-07-22' },
  { serialNo: 'ECM000004', name: 'Margin Call', author: 'J.C. Chandor', category: 'Economics', type: 'Movie', status: 'Available', cost: 145, procurementDate: '2023-08-28' },
  // Fiction Movies
  { serialNo: 'FCM000001', name: 'The Lord of the Rings', author: 'Peter Jackson', category: 'Fiction', type: 'Movie', status: 'Available', cost: 225, procurementDate: '2023-09-10' },
  { serialNo: 'FCM000002', name: 'Harry Potter', author: 'Chris Columbus', category: 'Fiction', type: 'Movie', status: 'Available', cost: 210, procurementDate: '2023-10-15' },
  { serialNo: 'FCM000003', name: 'Star Wars', author: 'George Lucas', category: 'Fiction', type: 'Movie', status: 'Available', cost: 230, procurementDate: '2023-11-20' },
  { serialNo: 'FCM000004', name: 'The Matrix', author: 'Wachowski Sisters', category: 'Fiction', type: 'Movie', status: 'Available', cost: 195, procurementDate: '2023-12-25' },
  // Children Movies
  { serialNo: 'CHM000001', name: 'The Lion King', author: 'Roger Allers', category: 'Children', type: 'Movie', status: 'Available', cost: 140, procurementDate: '2024-01-15' },
  { serialNo: 'CHM000002', name: 'Finding Nemo', author: 'Andrew Stanton', category: 'Children', type: 'Movie', status: 'Available', cost: 135, procurementDate: '2024-02-20' },
  { serialNo: 'CHM000003', name: 'Toy Story', author: 'John Lasseter', category: 'Children', type: 'Movie', status: 'Available', cost: 145, procurementDate: '2024-03-25' },
  { serialNo: 'CHM000004', name: 'Frozen', author: 'Chris Buck', category: 'Children', type: 'Movie', status: 'Available', cost: 150, procurementDate: '2024-04-30' },
  // Personal Development Movies
  { serialNo: 'PDM000001', name: 'The Secret', author: 'Drew Heriot', category: 'Personal Development', type: 'Movie', status: 'Available', cost: 130, procurementDate: '2024-05-05' },
  { serialNo: 'PDM000002', name: 'The Pursuit of Happyness', author: 'Gabriele Muccino', category: 'Personal Development', type: 'Movie', status: 'Available', cost: 155, procurementDate: '2024-06-10' },
  { serialNo: 'PDM000003', name: 'Good Will Hunting', author: 'Gus Van Sant', category: 'Personal Development', type: 'Movie', status: 'Available', cost: 165, procurementDate: '2024-07-15' },
  { serialNo: 'PDM000004', name: 'Into the Wild', author: 'Sean Penn', category: 'Personal Development', type: 'Movie', status: 'Available', cost: 145, procurementDate: '2024-08-20' },
];

export const initialMemberships = [
  { membershipId: 'MEM000001', firstName: 'John', lastName: 'Doe', contactNumber: '9876543210', address: '123 Main Street, Mumbai, Maharashtra 400001', aadharNo: '1234 5678 9012', startDate: '2025-01-01', endDate: '2026-01-01', status: 'Active', fineAmount: 0 },
  { membershipId: 'MEM000002', firstName: 'Jane', lastName: 'Smith', contactNumber: '8765432109', address: '456 Park Avenue, Delhi, Delhi 110001', aadharNo: '2345 6789 0123', startDate: '2025-03-01', endDate: '2026-03-01', status: 'Active', fineAmount: 50 },
  { membershipId: 'MEM000003', firstName: 'Bob', lastName: 'Wilson', contactNumber: '7654321098', address: '789 Oak Lane, Bangalore, Karnataka 560001', aadharNo: '3456 7890 1234', startDate: '2024-01-01', endDate: '2025-01-01', status: 'Inactive', fineAmount: 0 },
  { membershipId: 'MEM000004', firstName: 'Alice', lastName: 'Johnson', contactNumber: '6543210987', address: '321 River Road, Chennai, Tamil Nadu 600001', aadharNo: '4567 8901 2345', startDate: '2025-06-01', endDate: '2027-06-01', status: 'Active', fineAmount: 0 },
];

export const initialIssues = [
  { issueId: 'ISS000001', serialNo: 'SCB000004', membershipId: 'MEM000001', issueDate: past(10), returnDate: future(5), actualReturnDate: null, finePaid: false, remarks: 'Standard issue', status: 'Active' },
  { issueId: 'ISS000002', serialNo: 'FCB000002', membershipId: 'MEM000002', issueDate: past(20), returnDate: past(5), actualReturnDate: null, finePaid: false, remarks: '', status: 'Overdue' },
  { issueId: 'ISS000003', serialNo: 'ECM000003', membershipId: 'MEM000004', issueDate: past(3), returnDate: future(12), actualReturnDate: null, finePaid: false, remarks: 'Special request', status: 'Active' },
  { issueId: 'ISS000004', serialNo: 'FCM000002', membershipId: 'MEM000001', issueDate: past(30), returnDate: past(15), actualReturnDate: past(15), finePaid: true, remarks: 'Returned on time', status: 'Returned' },
];

export const initialIssueRequests = [
  { requestId: 'REQ000001', membershipId: 'MEM000003', serialNo: 'PDB000001', requestDate: past(5), fulfilledDate: null, status: 'Pending' },
  { requestId: 'REQ000002', membershipId: 'MEM000002', serialNo: 'SCB000001', requestDate: past(10), fulfilledDate: past(8), status: 'Fulfilled' },
];
