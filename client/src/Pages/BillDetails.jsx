import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import moment from 'moment';

const BillDetails = () => {
  const { billId } = useParams();
  const [bill, setBill] = useState(null);

  useEffect(() => {
    fetchBillDetails();
  }, []);

  const fetchBillDetails = async () => {
    try {
      const response = await axios.get(`/api/bill/${billId}`);
      setBill(response.data);
    } catch (error) {
      console.error('Error fetching bill details:', error);
    }
  };

  if (!bill) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <main className="flex-grow p-8">
        <div className="mb-4">
          <h1 className="text-2xl font-bold">Bill Details</h1>
        </div>
        <div className="bg-white shadow rounded p-4 mb-4">
          <div className="mb-4">
            <h2 className="text-lg font-medium">Rate List: {bill.rateListName}</h2>
          </div>
          <div className="mb-4">
            <h2 className="text-lg font-medium">Date: {moment(bill.date).format('DD MMM YYYY hh:mm A')}</h2>
          </div>
          <table className="min-w-full divide-y divide-gray-200 mb-4">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Art Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bill.items.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.artNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.rate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4">
            <span className="text-lg font-bold">Discount: {bill.discount}%</span>
          </div>
          <div className="mt-4">
            <span className="text-lg font-bold">Total: ${bill.total.toFixed(2)}</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BillDetails;
