import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';


const BillDetailsPage = () => {
  const { billId } = useParams();
  const [bill, setBill] = useState(null);
  const componentRef = useRef();

  useEffect(() => {
    fetchBillDetails();
  }, []);

  const fetchBillDetails = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/bill/details/${billId}`);
      setBill(response.data);
    } catch (error) {
      console.error('Error fetching bill details:', error);
    }
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  if (!bill) return <div>Loading...</div>;

  const totalAmount = bill?.items?.reduce((acc, item) => acc + item.total, 0);
  const discountAmount = (totalAmount * bill.discount) / 100;
  const amountToBePaid = totalAmount - discountAmount;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <main className="flex-grow p-8">
        <div ref={componentRef} className="bg-white p-6 shadow-md rounded-md">
          <h1 className="text-2xl font-bold text-center mb-4">Invoice</h1>
          <div className="text-center mb-4">
            <p className="text-lg font-semibold italic">WoolArt <span className='not-italic '>Beshesher Dass Fateh Chand Jain</span></p>
            <p>{new Date(bill.date).toLocaleDateString()}</p>
            <p>{new Date(bill.date).toLocaleTimeString()}</p>
          </div>
          <hr className="my-4" />
          <table className="min-w-full divide-y divide-gray-200 mb-4">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr. No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Art Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bill?.items?.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.artNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{item.rate.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{item.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <hr className="my-4" />
          <div className="flex justify-between mb-4">
            <span>Discount:</span>
            <span>{bill.discount}%</span>
          </div>
          <div className="flex justify-between mb-4">
            <span>Discount Amount:</span>
            <span>₹{discountAmount.toFixed(2)}</span>
          </div>
          <hr className="my-4" />
          <div className="flex justify-between mb-4 font-bold">
            <span>Amount to be Paid:</span>
            <span>₹{amountToBePaid.toFixed(2)}</span>
          </div>
        </div>
        <button
          onClick={handlePrint}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Print PDF
        </button>
      </main>
    </div>
  );
};

export default BillDetailsPage;
