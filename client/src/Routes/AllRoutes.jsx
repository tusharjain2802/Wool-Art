import { Route, Routes } from "react-router-dom";
import Home from "../Pages/Home";
import RateList from "../Pages/RateList";
import PrivateLayout from "../Layout/PrivateLayout";

function AllRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PrivateLayout>
            <Home />
          </PrivateLayout>
        }
      />

      <Route path="/list/:listName" element={
        <PrivateLayout>
          <RateList />
        </PrivateLayout>
      } />

    </Routes>
  );
}

export default AllRoutes;
