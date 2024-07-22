import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { MdDelete } from "react-icons/md";

const BillsPage = () => {
  const [rateLists, setRateLists] = useState([]);
  const [selectedRateList, setSelectedRateList] = useState(null);
  const [artNumber, setArtNumber] = useState('');
  const [billItems, setBillItems] = useState([]);
  const [discount, setDiscount] = useState(0);

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


  const handleAddItem = () => {
    if (!selectedRateList) return;
    const item = selectedRateList.items.find((item) => item.artNumber === artNumber);
    if (!item) {
      toast.error('Invalid art number');
      return;
    }
    setBillItems((prevItems) => [
      ...prevItems,
      { ...item, quantity: 1, total: item.rate },
    ]);
    setArtNumber('');
  };

  const handleQuantityChange = (index, quantity) => {
    const updatedItems = [...billItems];
    updatedItems[index].quantity = quantity;
    updatedItems[index].total = updatedItems[index].rate * quantity;
    setBillItems(updatedItems);
  };

  const handleDeleteItem = (index) => {
    setBillItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  const handleDiscountChange = (percentage) => {
    setDiscount(percentage);
  };

  const getTotal = () => {
    const sum = billItems.reduce((acc, item) => acc + item.total, 0);
    return sum - (sum * discount) / 100;
  };

  const handleSaveBill = async () => {
    try {
      const total = getTotal();
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/bill/save`, {
        rateListName: selectedRateList.rateListName,
        items: billItems,
        discount,
        total,
      });
      if (response.status === 201) {
        toast.success('Bill saved successfully');
        setBillItems([]);
        setDiscount(0);
        setSelectedRateList(null);
      }
      else{
        console.log(response);
      }
    } catch (error) {
      toast.error('Error saving bill:', error);
    //   alert('Error saving bill');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <main className="flex-grow p-8">
        <div className="mb-4">
          <h1 className="text-2xl font-bold">Generate Bill</h1>
        </div>
        <div className="bg-white shadow rounded p-4 mb-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Rate List</label>
            <select
              className="border p-2 w-full"
              value={selectedRateList ? selectedRateList._id : ''}
              onChange={(e) => {
                const selectedList = rateLists.find((list) => list._id === e.target.value);
                setSelectedRateList(selectedList);
                setBillItems([]);
              }}
            >
              <option value="">Select Rate List</option>
              {rateLists.map((list) => (
                <option key={list._id} value={list._id}>
                  {list.rateListName}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center mb-4">
            <input
              type="text"
              placeholder="Art Number"
              className="border p-2 mr-2 flex-grow"
              value={artNumber}
              onChange={(e) => setArtNumber(e.target.value)}
              disabled={!selectedRateList}
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={handleAddItem}
              disabled={!selectedRateList}
            >
              Add
            </button>
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Art Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {billItems.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.artNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.rate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <select
                      className="border p-2"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(index, parseInt(e.target.value))}
                    >
                      {[...Array(10).keys()].map((num) => (
                        <option key={num + 1} value={num + 1}>
                          {num + 1}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.total}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      className="text-red-600 hover:text-red-900"
                      onClick={() => handleDeleteItem(index)}
                    >
                      <MdDelete size={21}/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                className={`bg-${discount === 0 ? 'blue' : 'gray'}-500 text-white px-4 py-2 rounded`}
                onClick={() => handleDiscountChange(0)}
              >
                No Discount
              </button>
              <button
                className={`bg-${discount === 5 ? 'blue' : 'gray'}-500 text-white px-4 py-2 rounded`}
                onClick={() => handleDiscountChange(5)}
              >
                5%
              </button>
              <button
                className={`bg-${discount === 10 ? 'blue' : 'gray'}-500 text-white px-4 py-2 rounded`}
                onClick={() => handleDiscountChange(10)}
              >
                10%
              </button>
              <input
                type="number"
                placeholder="Custom"
                className="border p-2 w-20"
                onChange={(e) => handleDiscountChange(parseInt(e.target.value))}
              />
            </div>
            <div>
              <span className="text-lg font-bold">Total: ₹{getTotal()}</span>
            </div>
          </div>
          <div className="mt-4">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded"
              onClick={handleSaveBill}
            >
              Save Bill
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BillsPage;
