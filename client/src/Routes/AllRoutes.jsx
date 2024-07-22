import { Route, Routes } from "react-router-dom";
import Home from "../Pages/Home";
import RateList from "../Pages/RateList";
import GenerateBill from '../Pages/GenerateBill'
import PrivateLayout from "../Layout/PrivateLayout";
import Bills from "../Pages/Bills";
import BillDetails from "../Pages/BillDetails";

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

      <Route path="/list/:rateListId" element={
        <PrivateLayout>
          <RateList />
        </PrivateLayout>
      } />

      <Route path="/generate-bill" element={
        <PrivateLayout>
          <GenerateBill />
        </PrivateLayout>
      } />

      <Route path="bills" element={
        <PrivateLayout>
          <Bills />
        </PrivateLayout>
      } />

      <Route path="/bill-details/:billId" element={
        <PrivateLayout>
          <BillDetails />
        </PrivateLayout>
      } />

    </Routes>
  );
}

export default AllRoutes;
