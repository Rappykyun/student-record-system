'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import StudentTable from '@/components/StudentTable';
import StudentForm from '@/components/StudentForm';
import DeleteConfirm from '@/components/DeleteConfirm';
import { Student } from '@/db/schema';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ username: string; role: string } | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  useEffect(() => {
    fetchUser();
    fetchStudents();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredStudents(students);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = students.filter(
        (student) =>
          student.fullName.toLowerCase().includes(query) ||
          student.studentId.toLowerCase().includes(query) ||
          student.program.toLowerCase().includes(query) ||
          student.yearLevel.toLowerCase().includes(query) ||
          student.email.toLowerCase().includes(query)
      );
      setFilteredStudents(filtered);
    }
  }, [searchQuery, students]);

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (!response.ok) {
        router.push('/login');
        return;
      }
      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      console.error('Fetch user error:', error);
      router.push('/login');
    }
  };

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/students');
      if (!response.ok) {
        throw new Error('Failed to fetch students');
      }
      const data = await response.json();
      setStudents(data.students);
      setFilteredStudents(data.students);
    } catch (error) {
      console.error('Fetch students error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddStudent = () => {
    setSelectedStudent(null);
    setShowForm(true);
  };

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setShowForm(true);
  };

  const handleDeleteStudent = (student: Student) => {
    setSelectedStudent(student);
    setShowDeleteConfirm(true);
  };

  const handleExportCSV = async () => {
    try {
      const response = await fetch('/api/students/export');
      if (!response.ok) {
        throw new Error('Failed to export data');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `student-records-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export data');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Action Bar */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex-1 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search by name, student ID, program, year level, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border text-gray-900 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={handleExportCSV}
              className="flex-1 sm:flex-none px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Export CSV
            </button>
            {(user.role === 'staff' || user.role === 'admin') && (
              <button
                onClick={handleAddStudent}
                className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add Student
              </button>
            )}
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-500 text-sm">Total Students</p>
            <p className="text-2xl font-bold text-gray-900">{students.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-500 text-sm">Active</p>
            <p className="text-2xl font-bold text-green-600">
              {students.filter((s) => s.status === 'active').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-500 text-sm">Graduated</p>
            <p className="text-2xl font-bold text-blue-600">
              {students.filter((s) => s.status === 'graduated').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-500 text-sm">Inactive</p>
            <p className="text-2xl font-bold text-gray-600">
              {students.filter((s) => s.status === 'inactive').length}
            </p>
          </div>
        </div>

        {/* Student Table */}
        {isLoading ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">Loading students...</p>
          </div>
        ) : (
          <StudentTable
            students={filteredStudents}
            userRole={user.role}
            onEdit={handleEditStudent}
            onDelete={handleDeleteStudent}
          />
        )}

        {searchQuery && filteredStudents.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow mt-4">
            <p className="text-gray-500">No students found matching "{searchQuery}"</p>
          </div>
        )}
      </main>

      {/* Modals */}
      {showForm && (
        <StudentForm
          student={selectedStudent}
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            fetchStudents();
            setShowForm(false);
          }}
        />
      )}

      {showDeleteConfirm && selectedStudent && (
        <DeleteConfirm
          student={selectedStudent}
          onClose={() => setShowDeleteConfirm(false)}
          onSuccess={() => {
            fetchStudents();
            setShowDeleteConfirm(false);
          }}
        />
      )}
    </div>
  );
}

