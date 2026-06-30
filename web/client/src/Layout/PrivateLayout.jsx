import PropTypes from "prop-types";
import FooterComponent from "../Components/Footer/Footer";
import Navbar from "../Components/Header/Header";
const PrivateLayout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
      <FooterComponent />
    </div>
  );
};

PrivateLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PrivateLayout;
