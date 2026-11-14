
import { Link } from "react-router-dom";

function Unauthorized() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-5xl font-bold text-red-600">403</h1>

      <h2 className="text-2xl font-semibold mt-3">
        Access Denied
      </h2>

      <p className="text-gray-600 mt-2">
        You don't have permission to access this page.
      </p>

      <Link
        to="/login"
        className="mt-5 bg-blue-600 text-white px-5 py-2 rounded-lg"
      >
        Back to Login
      </Link>
    </div>
  );
}

export default Unauthorized;
