// MongoDB Sample Data Script
// Run with: mongosh jobportal < sample-data.js

use('jobportal');

// Clear existing data
db.users.deleteMany({});
db.jobs.deleteMany({});
db.applications.deleteMany({});
db.notifications.deleteMany({});
db.saved_jobs.deleteMany({});

// Note: Passwords are BCrypt hashed
// admin@jobportal.com     -> Admin@123
// employer@techcorp.com   -> Employer@123
// student@example.com     -> Student@123

const adminId = new ObjectId();
const employerId = new ObjectId();
const studentId = new ObjectId();

db.users.insertMany([
  {
    _id: adminId,
    fullName: "Admin User",
    email: "admin@jobportal.com",
    password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK2i",
    role: "ADMIN",
    active: true,
    emailVerified: true,
    profileCompleteness: 100,
    skills: [],
    education: [],
    experience: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: employerId,
    fullName: "Tech Corp HR",
    email: "employer@techcorp.com",
    password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK2i",
    role: "EMPLOYER",
    companyName: "TechCorp Solutions",
    companyDescription: "Leading software development company specializing in enterprise solutions",
    companyWebsite: "https://techcorp.com",
    companySize: "500-1000",
    industry: "Information Technology",
    location: "San Francisco, CA",
    active: true,
    emailVerified: true,
    profileCompleteness: 90,
    skills: [],
    education: [],
    experience: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: studentId,
    fullName: "John Doe",
    email: "student@example.com",
    password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK2i",
    role: "STUDENT",
    phone: "+1-555-0100",
    location: "New York, NY",
    profileSummary: "Passionate software developer with 2 years of experience in Java and React",
    skills: ["Java", "Spring Boot", "React", "MongoDB", "Docker", "AWS"],
    education: [
      {
        institution: "State University",
        degree: "Bachelor of Science",
        fieldOfStudy: "Computer Science",
        startYear: "2018",
        endYear: "2022",
        grade: "3.8 GPA",
        current: false
      }
    ],
    experience: [
      {
        company: "StartupXYZ",
        position: "Junior Developer",
        description: "Developed REST APIs using Spring Boot and React frontend",
        startDate: "2022-06",
        endDate: "2023-12",
        current: false,
        location: "New York, NY"
      }
    ],
    active: true,
    emailVerified: true,
    profileCompleteness: 85,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// Create indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.jobs.createIndex({ employerId: 1 });
db.jobs.createIndex({ status: 1 });
db.jobs.createIndex({ title: "text", description: "text", companyName: "text" });
db.applications.createIndex({ jobId: 1, applicantId: 1 }, { unique: true });
db.applications.createIndex({ applicantId: 1 });
db.applications.createIndex({ employerId: 1 });
db.notifications.createIndex({ userId: 1 });
db.saved_jobs.createIndex({ userId: 1, jobId: 1 }, { unique: true });

print("Sample data inserted successfully!");
print("Login credentials:");
print("  Admin:    admin@jobportal.com / Admin@123");
print("  Employer: employer@techcorp.com / Employer@123");
print("  Student:  student@example.com / Student@123");
