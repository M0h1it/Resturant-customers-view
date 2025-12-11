import BottomNav from "../components/BottomNav";
import { FaClipboardList } from "react-icons/fa";

export default function MenuHeader() {
  const deviceId = localStorage.getItem("DEVICE_TABLE");
  return (
    <>
      <header className="d-flex justify-content-between align-items-center p-3 shadow-sm bg-danger">
        
        {/* Title */}
        <h4 className="m-0 text-white fw-bold">Menu {deviceId && ` - Table ${deviceId}`}</h4>

        {/* Bill Icon Button */}
        <button 
          aria-label="View Bill" 
          className="btn p-0 bg-transparent border-0"
        >
          <FaClipboardList size={28} className="text-white" />
        </button>

      </header>

      {/* Bottom Navigation */}
      <BottomNav />
    </>
  );
}
