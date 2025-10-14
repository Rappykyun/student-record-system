import { db } from './index';
import { users, students } from './schema';
import { hashPassword } from '../lib/password';

async function seed() {
  console.log('🌱 Seeding database...');

  // Create default admin user
  const adminPassword = await hashPassword('admin123');
  const staffPassword = await hashPassword('staff123');

  await db.insert(users).values([
    {
      username: 'admin',
      passwordHash: adminPassword,
      role: 'admin',
    },
    {
      username: 'staff',
      passwordHash: staffPassword,
      role: 'staff',
    },
  ]);

  console.log('✅ Created default users:');
  console.log('   Admin - username: admin, password: admin123');
  console.log('   Staff - username: staff, password: staff123');

  // Create sample students
  await db.insert(students).values([
    {
      studentId: '2024-0001',
      fullName: 'Juan Dela Cruz',
      email: 'juan.delacruz@example.com',
      phone: '0917-123-4567',
      dateOfBirth: '2005-03-15',
      enrollmentDate: '2024-08-15',
      street: '123 Rizal Street',
      barangay: 'Barangay San Jose',
      city: 'Manila',
      province: 'Metro Manila',
      postalCode: '1000',
      guardianName: 'Maria Dela Cruz',
      guardianPhone: '0918-234-5678',
      program: 'BSIT',
      yearLevel: '1st Year',
      status: 'active',
    },
    {
      studentId: '2024-0002',
      fullName: 'Maria Santos',
      email: 'maria.santos@example.com',
      phone: '0919-345-6789',
      dateOfBirth: '2004-07-22',
      enrollmentDate: '2024-08-15',
      street: '456 Bonifacio Avenue',
      barangay: 'Barangay Poblacion',
      city: 'Quezon City',
      province: 'Metro Manila',
      postalCode: '1100',
      guardianName: 'Jose Santos',
      guardianPhone: '0920-456-7890',
      program: 'BSCS',
      yearLevel: '2nd Year',
      status: 'active',
    },
  ]);

  console.log('✅ Created sample student records');
  console.log('🎉 Seeding complete!');
}

seed().catch(console.error);

