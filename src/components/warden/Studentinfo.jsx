// src/components/warden/WardenPortal.jsx
import { useState } from 'react';
import { UserPlus, Upload, User, Lock, Eye, EyeOff, Phone, Hash, Home, Users, Building } from 'lucide-react';

export default function WardenPortal() {
  const [username] = useState("warden"); // demo
  const [studentData, setStudentData] = useState({
    name: '', enrollmentNumber: '', address: '', parentsName: '', phoneNumber: '', roomNumber: '', studentImage: null
  });
  const [imagePreview, setImagePreview] = useState('');
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStudentData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setStudentData(prev => ({ ...prev, studentImage: file }));
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmitStudent = () => {
    setFormError('');
    if (!studentData.name || !studentData.enrollmentNumber) {
      setFormError('Please fill required fields');
      return;
    }
    setSuccessMessage('Student information saved successfully!');
    setStudentData({ name: '', enrollmentNumber: '', address: '', parentsName: '', phoneNumber: '', roomNumber: '', studentImage: null });
    setImagePreview('');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Student Information Management</h1>

      {successMessage && <p className="bg-green-100 text-green-700 p-2 rounded mb-4">{successMessage}</p>}
      {formError && <p className="bg-red-100 text-red-700 p-2 rounded mb-4">{formError}</p>}

      <div className="bg-white p-6 rounded shadow-md grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">Student Image</label>
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed">
              {imagePreview ? <img src={imagePreview} alt="preview" className="w-24 h-24 object-cover rounded-lg" /> : <UserPlus className="w-8 h-8 text-gray-400" />}
            </div>
            <label className="cursor-pointer bg-blue-50 text-blue-600 px-4 py-2 rounded flex items-center gap-2">
              <Upload className="w-5 h-5" /> Upload
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm mb-2">Student Name</label>
          <input name="name" value={studentData.name} onChange={handleInputChange} className="w-full border p-2 rounded" />
        </div>

        <div>
          <label className="block text-sm mb-2">Enrollment Number</label>
          <input name="enrollmentNumber" value={studentData.enrollmentNumber} onChange={handleInputChange} className="w-full border p-2 rounded" />
        </div>

        <div>
          <label className="block text-sm mb-2">Parent Name</label>
          <input name="parentsName" value={studentData.parentsName} onChange={handleInputChange} className="w-full border p-2 rounded" />
        </div>

        <div>
          <label className="block text-sm mb-2">Phone Number</label>
          <input name="phoneNumber" value={studentData.phoneNumber} onChange={handleInputChange} className="w-full border p-2 rounded" />
        </div>

        <div>
          <label className="block text-sm mb-2">Room Number</label>
          <input name="roomNumber" value={studentData.roomNumber} onChange={handleInputChange} className="w-full border p-2 rounded" />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm mb-2">Address</label>
          <textarea name="address" value={studentData.address} onChange={handleInputChange} className="w-full border p-2 rounded" rows="3"></textarea>
        </div>
      </div>

      <button
        onClick={handleSubmitStudent}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Save Student
      </button>
    </div>
  );
}
