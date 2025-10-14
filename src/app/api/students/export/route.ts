import { NextResponse } from 'next/server';
import { db } from '@/db';
import { students } from '@/db/schema';
import { requireAuth } from '@/lib/auth';
import { desc } from 'drizzle-orm';

export async function GET() {
  try {
    await requireAuth();

    const allStudents = await db
      .select()
      .from(students)
      .orderBy(desc(students.createdAt));

    // Create CSV header
    const headers = [
      'Student ID',
      'Full Name',
      'Email',
      'Phone',
      'Date of Birth',
      'Enrollment Date',
      'Street',
      'Barangay',
      'City',
      'Province',
      'Postal Code',
      'Guardian Name',
      'Guardian Phone',
      'Program',
      'Year Level',
      'Status',
    ];

    // Create CSV rows
    const csvRows = [
      headers.join(','),
      ...allStudents.map((student) =>
        [
          student.studentId,
          `"${student.fullName}"`,
          student.email,
          student.phone,
          student.dateOfBirth,
          student.enrollmentDate,
          `"${student.street}"`,
          `"${student.barangay}"`,
          `"${student.city}"`,
          `"${student.province}"`,
          student.postalCode,
          `"${student.guardianName}"`,
          student.guardianPhone,
          student.program,
          student.yearLevel,
          student.status,
        ].join(',')
      ),
    ];

    const csv = csvRows.join('\n');

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="student-records-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error('Export students error:', error);
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json(
      { error: 'An error occurred while exporting students' },
      { status: 500 }
    );
  }
}

