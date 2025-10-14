import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { students } from '@/db/schema';
import { requireAuth, requireAdmin } from '@/lib/auth';
import { eq } from 'drizzle-orm';

// GET single student
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await params;

    const student = await db.query.students.findFirst({
      where: eq(students.id, parseInt(id)),
    });

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ student });
  } catch (error) {
    console.error('Get student error:', error);
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json(
      { error: 'An error occurred while fetching student' },
      { status: 500 }
    );
  }
}

// PUT update student (Staff & Admin)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await params;
    const body = await request.json();

    // Remove studentId from update (it should be immutable)
    const { studentId, ...updateData } = body;

    const updatedStudent = await db
      .update(students)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(students.id, parseInt(id)))
      .returning();

    if (!updatedStudent.length) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ student: updatedStudent[0] });
  } catch (error) {
    console.error('Update student error:', error);
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json(
      { error: 'An error occurred while updating student' },
      { status: 500 }
    );
  }
}

// DELETE student (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(); // Admin only
    const { id } = await params;

    const deletedStudent = await db
      .delete(students)
      .where(eq(students.id, parseInt(id)))
      .returning();

    if (!deletedStudent.length) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete student error:', error);
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof Error && error.message.includes('Admin access required')) {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }
    return NextResponse.json(
      { error: 'An error occurred while deleting student' },
      { status: 500 }
    );
  }
}

