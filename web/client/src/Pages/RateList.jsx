import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const RateListDetailPage = () => {
  const { rateListId } = useParams();
  const [rateList, setRateList] = useState(null);
  const [newArtNumber, setNewArtNumber] = useState('');
  const [newRate, setNewRate] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedArtNumber, setEditedArtNumber] = useState('');
  const [editedRate, setEditedRate] = useState('');

  useEffect(() => {
    fetchRateListDetails();
  }, []);

  const fetchRateListDetails = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/rate-list/${rateListId}`);
      console.log(response);
      if(response.status ===200){
        setRateList(response.data);
      }
      else{
        toast.error("Some error occured while fetching the data");
      }
    } catch (error) {
      console.error('Error fetching rate list details:', error);
    }
  };

  const handleAddItem = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/rate-list/${rateListId}/add-item`, {
        artNumber: newArtNumber,
        rate: newRate
      });
      setRateList(response.data);
      setNewArtNumber('');
      setNewRate('');
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleUpdateItem = async (index) => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/rate-list/${rateListId}/update-item`, {
        index,
        artNumber: editedArtNumber,
        rate: editedRate
      });
      if(response.status===200){
        toast.success("Item updated successfully")
        setRateList(response.data);
        setEditingIndex(null);
      }else{
        toast.error("Some error occured");
      }
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleDeleteItem = async (index) => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/rate-list/${rateListId}/delete-item`, {
        data: { index }
      });
      if(response.status===200){
        toast.success("Item deleted successfully");
        setRateList(response.data);
      }else{
        toast.error("Some error occured");
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  if (!rateList) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      
      <main className="flex-grow p-8">
        <div className="mb-4">
          <h1 className="text-2xl font-bold">{rateList.rateListName}</h1>
        </div>
        <div className="bg-white shadow rounded p-4 mb-4">
          <div className="flex items-center mb-4">
            <input
              type="text"
              placeholder="Art Number"
              className="border p-2 mr-2 flex-grow"
              value={newArtNumber}
              onChange={(e) => setNewArtNumber(e.target.value)}
            />
            <input
              type="number"
              placeholder="Rate"
              className="border p-2 mr-2 flex-grow"
              value={newRate}
              onChange={(e) => setNewRate(e.target.value)}
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={handleAddItem}
            >
              Add
            </button>
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Art Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rateList?.items?.map((item, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {editingIndex === index ? (
                      <input
                        type="text"
                        className="border p-2"
                        value={editedArtNumber}
                        onChange={(e) => setEditedArtNumber(e.target.value)}
                      />
                    ) : (
                      item.artNumber
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {editingIndex === index ? (
                      <input
                        type="number"
                        className="border p-2"
                        value={editedRate}
                        onChange={(e) => setEditedRate(e.target.value)}
                      />
                    ) : (
                      item.rate
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {editingIndex === index ? (
                      <button
                        className="bg-green-500 text-white px-4 py-2 rounded"
                        onClick={() => handleUpdateItem(index)}
                      >
                        Save
                      </button>
                    ) : (
                      <>
                      <button
                        className="text-blue-600 hover:text-blue-900"
                        onClick={() => {
                          setEditingIndex(index);
                          setEditedArtNumber(item.artNumber);
                          setEditedRate(item.rate);
                        }}
                      >
                        <FaEdit size={21} />
                      </button>
                       <button
                       className="text-red-600 ml-5 hover:text-red-900"
                       onClick={() => handleDeleteItem(index)}
                     >
                       <MdDelete size={21} />
                     </button>
                     </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default RateListDetailPage;
