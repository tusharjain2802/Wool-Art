import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

const BillsPage = () => {
  const [bills, setBills] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/bill/view`);
      setBills(response.data);
    } catch (error) {
      console.error('Error fetching bills:', error);
    }
  };

  const groupBillsByDate = (bills) => {
    return bills.reduce((grouped, bill) => {
      const date = moment(bill.date).format('YYYY-MM-DD');
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
        <div className="mb-4">
          <h1 className="text-2xl font-bold">Bills</h1>
        </div>
        <div className="bg-white shadow rounded p-4 mb-4">
          {Object.keys(groupedBills).map((date) => (
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {groupedBills[date].map((bill) => (
                    <tr
                      key={bill._id}
                      className="hover:bg-gray-100 cursor-pointer"
                      onClick={() => navigate(`/bill-details/${bill._id}`)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {moment(bill.date).format('hh:mm A')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {bill.items.reduce((acc, item) => acc + item.quantity, 0)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bill.discount}%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${bill.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default BillsPage;
