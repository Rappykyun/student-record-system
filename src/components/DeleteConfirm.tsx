'use client';

import { useState } from 'react';
import { Student } from '@/db/schema';

interface DeleteConfirmProps {
  student: Student;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DeleteConfirm({ student, onClose, onSuccess }: DeleteConfirmProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/students/${student.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to delete student');
        return;
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Delete Student Record</h2>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <p className="text-gray-700 mb-2">
          Are you sure you want to delete this student record?
        </p>
        <div className="bg-gray-50 p-4 rounded mb-6">
          <p className="font-semibold text-gray-900">{student.fullName}</p>
          <p className="text-sm text-gray-600">Student ID: {student.studentId}</p>
          <p className="text-sm text-gray-600">Program: {student.program}</p>
        </div>

        <p className="text-sm text-red-600 mb-6">
          This action cannot be undone.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isLoading}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

