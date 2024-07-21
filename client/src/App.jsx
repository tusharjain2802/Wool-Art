import './App.css';
import AllRoutes from './Routes/AllRoutes';
import {Toaster} from 'react-hot-toast'
export default function App() {
  return (
    <div className='max max-w-[1920px] mx-auto '>
      <AllRoutes />
      <Toaster />
    </div>
  );
}
