import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { students } from '@/db/schema';
import { requireAuth } from '@/lib/auth';
import { like, or, desc } from 'drizzle-orm';

// GET all students with optional search
export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search');

    let query = db.select().from(students);

    if (search) {
      query = query.where(
        or(
          like(students.fullName, `%${search}%`),
          like(students.studentId, `%${search}%`),
          like(students.program, `%${search}%`),
          like(students.yearLevel, `%${search}%`),
          like(students.email, `%${search}%`)
        )
      ) as typeof query;
    }

    const allStudents = await query.orderBy(desc(students.createdAt));

    return NextResponse.json({ students: allStudents });
  } catch (error) {
    console.error('Get students error:', error);
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json(
      { error: 'An error occurred while fetching students' },
      { status: 500 }
    );
  }
}

// POST create new student (Staff and Admin)
export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();

    // Only staff and admin can add students
    if (session.role !== 'staff' && session.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: Only staff and admin can add students' },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      'studentId', 'fullName', 'email', 'phone', 'dateOfBirth', 'enrollmentDate',
      'street', 'barangay', 'city', 'province', 'postalCode',
      'guardianName', 'guardianPhone', 'program', 'yearLevel'
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const newStudent = await db.insert(students).values({
      studentId: body.studentId,
      fullName: body.fullName,
      email: body.email,
      phone: body.phone,
      dateOfBirth: body.dateOfBirth,
      enrollmentDate: body.enrollmentDate,
      street: body.street,
      barangay: body.barangay,
      city: body.city,
      province: body.province,
      postalCode: body.postalCode,
      guardianName: body.guardianName,
      guardianPhone: body.guardianPhone,
      program: body.program,
      yearLevel: body.yearLevel,
      status: body.status || 'active',
    }).returning();

    return NextResponse.json({ student: newStudent[0] }, { status: 201 });
  } catch (error) {
    console.error('Create student error:', error);
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json(
      { error: 'An error occurred while creating student' },
      { status: 500 }
    );
  }
}

