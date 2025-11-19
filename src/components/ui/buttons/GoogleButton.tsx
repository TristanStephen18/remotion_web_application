import { backendPrefix } from "../../../config";

export const GoogleButton = () => (
  <button
    type="button"
    onClick={() => {
      window.location.href = `${backendPrefix}/authenticate/google`;
    }}
    className="
      w-full flex items-center justify-center gap-3 py-2 mt-3 
      bg-white text-gray-700 font-medium rounded-lg shadow-md
      transition-all duration-300 cursor-pointer relative overflow-hidden
      hover:scale-[1.03] hover:shadow-[0_0_15px_rgba(59,130,246,0.4)]
      active:scale-[0.98]
    "
  >
    <span className="absolute inset-0 bg-gradient-to-r from-blue-50 to-blue-100 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
    <span className="relative flex items-center gap-3">
      <img
        src="https://res.cloudinary.com/dnxc1lw18/image/upload/v1761736576/google_logo_sbrbgg.png"
        alt="Google"
        className="w-5 h-5"
      />
      Continue with Google
    </span>
  </button>
);
