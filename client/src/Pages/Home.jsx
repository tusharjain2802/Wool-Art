import { useEffect, useState } from 'react';
import axios from 'axios';
import {useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const RateListPage = () => {
  const [rateLists, setRateLists] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [newRateListName, setNewRateListName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchRateLists();
  }, []);

  const fetchRateLists = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/rate-lists`);
      const data = Array.isArray(response.data) ? response.data : [];
      setRateLists(data);
    } catch (error) {
      console.error('Error fetching rate lists:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/delete-list/${deleteId}`);
      console.log(response);
      if(response.status === 200){
        toast.success(response.data.message);
        setShowDeletePopup(false);
        fetchRateLists();
      }else{
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error deleting rate list:', error);
    }
  };

  const handleAddRateList = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/create-rate-list`, { rateListName: newRateListName });
      if (response.status === 201) {
        toast.success("Rate List Added Successfully")
        navigate(`/list/${newRateListName}`);
      }
    } catch (error) {
      console.error('Error creating rate list:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Rate Lists</h1>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => setShowAddPopup(true)}
        >
          Add Rate List
        </button>
      </div>
      <div className="bg-white shadow rounded p-4">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rateLists.length > 0 ? (
              rateLists.map((list) => (
                <tr key={list.rateListId}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{list.rateListName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      className="text-red-600 hover:text-red-900"
                      onClick={() =>{setShowDeletePopup(true); setDeleteId(list.rateListId)}}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="px-6 py-4 text-center text-sm text-gray-500">No rate lists available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {showDeletePopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete this rate list?</p>
            <div className="flex justify-end mt-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                onClick={() => setShowDeletePopup(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={handleDelete}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      {showAddPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-lg font-bold mb-4">Add Rate List</h2>
            <input
              type="text"
              placeholder="Enter rate list name"
              className="border p-2 w-full mb-4"
              value={newRateListName}
              onChange={(e) => setNewRateListName(e.target.value)}
            />
            <div className="flex justify-end mt-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                onClick={() => setShowAddPopup(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleAddRateList}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RateListPage;
