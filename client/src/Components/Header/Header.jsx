import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/"><div className="text-lg italic font-bold">
          WoolArt <span className='font-semibold not-italic '>Beshesher Dass Fateh Chand Jain</span>
        </div></Link>
        <nav>
          <Link to="/" className="text-white hover:text-gray-300 mx-2">
            Rate Lists
          </Link>
          <Link to="/bills" className="text-white hover:text-gray-300 mx-2">
            Bills
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
