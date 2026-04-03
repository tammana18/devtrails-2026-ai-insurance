import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-dark bg-dark px-4">
      <h4 className="text-white">🚚 Insurance AI</h4>

      <div>
        <button
          className="btn btn-outline-light me-2"
          onClick={() => navigate("/dashboard")}
        >
          Dashboard
        </button>

        <button
          className="btn btn-outline-light me-2"
          onClick={() => navigate("/policy")}
        >
          Policy
        </button>

        <button
          className="btn btn-outline-light me-2"
          onClick={() => navigate("/claims")}
        >
          Claims
        </button>

        <button className="btn btn-danger" onClick={logout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;