const users = [
  {
    username: "student",
    password: "library123",
    name: "Riya Patel",
    role: "Student",
    books: [
      { title: "Introduction to Algorithms", due: "12 Nov 2026" },
      { title: "Eloquent JavaScript", due: "15 Nov 2026" },
      { title: "Clean Code", due: "20 Nov 2026" }
    ]
  },
  {
    username: "staff",
    password: "staff456",
    name: "Mr. Anil Shah",
    role: "Staff",
    books: [
      { title: "Database System Concepts", due: "18 Nov 2026" },
      { title: "Computer Networks", due: "25 Nov 2026" }
    ]
  }
];

module.exports = users;