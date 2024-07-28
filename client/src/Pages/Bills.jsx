import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import moment from 'moment';
import toast from 'react-hot-toast';

const BillsPage = () => {
  const [bills, setBills] = useState([]);
  const [sortBy, setSortBy] = useState('date');
  const navigate = useNavigate();

  useEffect(() => {
    fetchBills();
  }, [sortBy]);

  const fetchBills = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/bill/view`);
      let fetchedBills = response.data;
      
      if (sortBy === 'customerName') {
        fetchedBills = fetchedBills.sort((a, b) => a.customerName.localeCompare(b.customerName));
      } else {
        fetchedBills = fetchedBills.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
      
      setBills(fetchedBills);
    } catch (error) {
      console.error('Error fetching bills:', error);
    }
  };

  const deleteBill = async (billId) => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/bill/delete/${billId}`);
      if (response.status === 200) {
        toast.success("Deleted successfully");
        setBills((prevBills) => prevBills.filter((bill) => bill.billId !== billId));
      } else {
        toast.error("Some error occurred");
      }
    } catch (error) {
      console.error('Error deleting bill:', error);
    }
  };

  const groupBillsByDate = (bills) => {
    return bills.reduce((grouped, bill) => {
      const date = moment(bill.createdAt).format('YYYY-MM-DD');
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(bill);
      return grouped;
    }, {});
  };

  const groupedBills = groupBillsByDate(bills);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <main className="flex-grow p-8">
        <div className="mb-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Bills</h1>
          <div className="flex items-center space-x-4">
            <select
              className="border p-2"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date">Sort by Date</option>
              <option value="customerName">Sort by Customer Name</option>
            </select>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => navigate('/generate-bill')}
            >
              Generate Bill
            </button>
          </div>
        </div>
        <div className="bg-white shadow rounded p-4 mb-4">
          {sortBy === 'date' ? (
            Object.keys(groupedBills).map((date) => (
              <div key={date} className="mb-6">
                <h2 className="text-lg font-medium mb-2">
                  {date === moment().format('YYYY-MM-DD')
                    ? 'Today'
                    : moment(date).format('DD MMM YYYY')}
                </h2>
                <table className="min-w-full divide-y divide-gray-200 mb-4">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {groupedBills[date].map((bill) => (
                      <tr
                        key={bill.billId}
                        className="hover:bg-gray-100 cursor-pointer"
                        onClick={() => navigate(`/bill-details/${bill.billId}`)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {moment(bill.createdAt).format('hh:mm A')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bill.customerName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {bill.items.reduce((acc, item) => acc + item.quantity, 0)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bill.discount}%</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"> ₹{bill.total.toFixed(2)}</td>
                        <td className={`px-6 py-4 whitespace-nowrap font-[500] text-sm ${bill.isPaid ? 'text-green-500' : 'text-red-500 '} `}>
                          {bill.isPaid ? 'Paid' : `Pending: ₹${bill.pendingBalance.toFixed(2)}`}
                        </td>
                        <td className="px-6 py-4 z-20 flex justify-center gap-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            className="text-blue-600 hover:text-blue-900"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/edit-bill/${bill.billId}`)
                            }}
                          >
                            <FaEdit size={21} />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-900"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteBill(bill.billId);
                            }}
                          >
                            <MdDelete size={21} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))
          ) : (
            <table className="min-w-full divide-y divide-gray-200 mb-4">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bills.map((bill) => (
                  <tr
                    key={bill.billId}
                    className="hover:bg-gray-100 cursor-pointer"
                    onClick={() => navigate(`/bill-details/${bill.billId}`)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {moment(bill.createdAt).format('DD MMM YYYY')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {moment(bill.createdAt).format('hh:mm A')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bill.customerName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {bill.items.reduce((acc, item) => acc + item.quantity, 0)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bill.discount}%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"> ₹{bill.total.toFixed(2)}</td>
                    <td className={`px-6 py-4 whitespace-nowrap font-[500] text-sm ${bill.isPaid ? 'text-green-500' : 'text-red-500 '} `}>
                      {bill.isPaid ? 'Paid' : `Pending: ₹${bill.pendingBalance.toFixed(2)}`}
                    </td>
                    <td className="px-6 py-4 z-20 flex justify-center gap-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        className="text-blue-600 hover:text-blue-900"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/edit-bill/${bill.billId}`)
                        }}
                      >
                        <FaEdit size={21} />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteBill(bill.billId);
                        }}
                      >
                        <MdDelete size={21} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
};

export default BillsPage;
