import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-lg font-bold">
          Wool-Art Beshesher Dass Fateh Chand Jain
        </div>
        <nav>
          <Link to="/rate-lists" className="text-white hover:text-gray-300 mx-2">
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
