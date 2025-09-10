// resources/js/Pages/Admin/Parkx/Index.jsx
import AdminLayout from "@/Layouts/AdminLayout";

function ParkxIndex({ users }) {
  return (
    <div>
      {/* your ParkX content */}
      <h1>Admin Index</h1>
    </div>
  );
}
ParkxIndex.layout = (page) => <AdminLayout children={page} />;
export default ParkxIndex;
