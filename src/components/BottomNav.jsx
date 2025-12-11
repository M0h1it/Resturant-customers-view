import { FaBookOpen, FaReceipt, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function BottomNav() {
  const [activeTab, setActiveTab] = useState("menu");
  const [showWaiterModal, setShowWaiterModal] = useState(false);
  const [showBillModal, setShowBillModal] = useState(false);
  const navigate = useNavigate();

  const handleWaiterClick = () => {
    setActiveTab("waiter");
    setShowWaiterModal(true);
  };

  const handleBillClick = () => {
    setActiveTab("bill");
    setShowBillModal(true);
  };

  return (
    <>
      {/* Bottom Navigation */}
      <nav className="navbar fixed-bottom bg-white shadow border-top py-1">
        <div className="container-fluid d-flex justify-content-around align-items-center">
          {/* Menu Button */}
          <button
            onClick={() => setActiveTab("menu")}
            className="btn text-center d-flex flex-column align-items-center border-0 bg-transparent"
          >
            <FaBookOpen
              size={22}
              className={activeTab === "menu" ? "text-danger" : "text-dark"}
            />
            <span
              className={`small mt-1 ${
                activeTab === "menu" ? "fw-bold text-danger" : "text-dark"
              }`}
            >
              Menu
            </span>
          </button>

          {/* Call Waiter Button */}
          <button
            onClick={handleWaiterClick}
            className="btn text-center d-flex flex-column align-items-center border-0 bg-transparent"
          >
            <FaUser
              size={22}
              className={activeTab === "waiter" ? "text-danger" : "text-dark"}
            />
            <span
              className={`small mt-1 ${
                activeTab === "waiter" ? "fw-bold text-danger" : "text-dark"
              }`}
            >
              Call Waiter
            </span>
          </button>

          {/* Ask Bill Button */}
          <button
            onClick={handleBillClick}
            className="btn text-center d-flex flex-column align-items-center border-0 bg-transparent"
          >
            <FaReceipt
              size={22}
              className={activeTab === "bill" ? "text-danger" : "text-dark"}
            />
            <span
              className={`small mt-1 ${
                activeTab === "bill" ? "fw-bold text-danger" : "text-dark"
              }`}
            >
              Ask for bill
            </span>
          </button>
        </div>
      </nav>

      {/* ================= WAITer Modal ================= */}
      {showWaiterModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content text-center p-4 rounded-4 shadow">
              <h4 className="fw-bold text-success">Waiter is coming!</h4>
              <p className="mb-3">
                Please stay seated, our staff has been notified.
              </p>

              <button
                className="btn btn-primary fw-bold px-4"
                onClick={() => {
                  setShowWaiterModal(false);
                  setActiveTab("menu");
                }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= BILL Modal ================= */}
      {showBillModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content text-center p-4 rounded-4 shadow">
              <h4 className="fw-bold text-success">Your bill is coming!</h4>
              <p className="mb-3">Our staff is preparing your bill.</p>

              <button
                className="btn btn-primary fw-bold px-4"
                onClick={() => {
                  setShowBillModal(false);
                  setActiveTab("menu");
                  navigate("/screensaver");
                }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
