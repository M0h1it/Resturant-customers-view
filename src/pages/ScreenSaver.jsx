// src/pages/ScreenSaver.jsx
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaBookOpen, FaUser } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";
import apiMain from "../api/apiMain";

export default function ScreenSaver() {
  const navigate = useNavigate();

  const [deviceId, setDeviceId] = useState(localStorage.getItem("DEVICE_TABLE") || "");
  const [tempId, setTempId] = useState("");
  const [bannerFiles, setBannerFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  /** Validate device_id */
  const validateDevice = async (value) => {
    try {
      const res = await apiMain.post("/get-schedule-data", { device_id: value });
      return res.data.code === 200;
    } catch {
      return false;
    }
  };

  const saveDeviceId = async () => {
    if (!tempId.trim()) return alert("Please enter table ID");

    const valid = await validateDevice(tempId);
    if (!valid) return alert("Invalid Table ID");

    localStorage.setItem("DEVICE_TABLE", tempId);
    setDeviceId(tempId);
  };

  const normalizeFileType = (t) => {
    if (!t) return "static_image";
    const type = t.toLowerCase();
    return type === "tamplate" ? "html" : type;
  };

  /** Fetch banners */
  useEffect(() => {
    if (!deviceId) {
      setLoading(false);
      return;
    }

    const fetchFiles = async () => {
      setLoading(true);
      try {
        const res = await apiMain.post("/get-schedule-data", { device_id: deviceId });
        const files = res.data?.data || [];
        setBannerFiles(files);
      } catch (err) {
        console.error("Banner Fetch Error:", err);
        setBannerFiles([]);
      }
      setLoading(false);
    };

    fetchFiles();
  }, [deviceId]);

  const isSingle = bannerFiles.length === 1;

  if (!deviceId) {
    return (
      <div className="vh-100 d-flex flex-column justify-content-center align-items-center text-center p-4">
        <h4>Enter Table Number</h4>

        <input
          type="number"
          placeholder="Enter device/table ID"
          className="form-control mt-3"
          style={{ maxWidth: 250 }}
          onChange={(e) => setTempId(e.target.value)}
        />

        <button className="btn btn-primary mt-3 px-4" onClick={saveDeviceId}>
          Save
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center bg-dark">
        <p className="text-white">Loading…</p>
      </div>
    );
  }

  return (
    <div className="vh-100 position-relative">
      <div
    className="position-absolute top-0 start-0 mt-2 ms-2 px-3 py-1 rounded-3 fw-bold"
    style={{ background: "rgba(252, 246, 246, 0.6)", color: "black", zIndex: 50 }}
  > {deviceId}
  </div>
      {/* Single */}
      {isSingle ? (
        <SingleBanner file={bannerFiles[0]} />
      ) : (
        <Swiper
          modules={[Autoplay]}
          autoplay={false}
          loop={true}
          allowTouchMove
          onSlideChange={handleSlideChange}
          onSwiper={(swiper) => setTimeout(() => handleSlideChange(swiper), 1500)}
          style={{ width: "100%" }}
        >
          {bannerFiles.map((file, i) => {
            const type = normalizeFileType(file.file_type);
            return (
              <SwiperSlide key={i}>
                <SlideContent type={type} file={file} />
              </SwiperSlide>
            );
          })}
        </Swiper>
      )}

      {/* Buttons */}
      <div className="position-absolute bottom-0 w-100 d-flex justify-content-between px-3 pb-3" style={{ zIndex: 20 }}>
        <button
          className="btn bg-white rounded-4 shadow fw-bold w-50 me-2 py-3"
          data-bs-toggle="modal"
          data-bs-backdrop="static"
          data-bs-target="#waiterModal"
        >
          <FaUser /> Call Waiter
        </button>

        <button className="btn btn-danger rounded-4 shadow fw-bold w-50 py-3" onClick={() => navigate("/menu")}>
          <FaBookOpen /> View Menu
        </button>
      </div>

      {/* Modal */}
      <div className="modal fade" id="waiterModal" tabIndex="-1" data-bs-backdrop="static">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content rounded-4 shadow p-4 text-center">
            <h4 className="text-success fw-bold">Request Sent ✔</h4>
            <p>Your waiter is on the way.</p>
            <button type="button" className="btn btn-primary" data-bs-dismiss="modal">
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/** SINGLE FILE */
function SingleBanner({ file }) {
  const type = file.file_type;
  if (type === "static_image") {
    return <img src={file.file_path} style={{ width: "100%" }} alt="" />;
  }
  return <video src={file.file_path} autoPlay muted loop playsInline style={{ width: "100%" }} />;
}

/** MULTI SLIDE */
function SlideContent({ file, type }) {
  if (type === "static_image" || type === "gif") {
    return <img src={file.file_path} style={{ width: "100%" }} alt="" />;
  }

  if (type === "html" || type === "url") {
    return (
      <iframe src={file.file_path} style={{ width: "100%", height: "100vh", border: "none" }}></iframe>
    );
  }

  return (
    <video src={file.file_path} autoPlay muted loop playsInline style={{ width: "100%" }} />
  );
}

/** SLIDE LOGIC */
function handleSlideChange(swiper) {
  const slides = swiper.slides;
  if (!slides || slides.length === 0) return;

  const slide = slides[swiper.activeIndex];
  if (!slide) return;

  const video = slide.querySelector("video");
  const iframe = slide.querySelector("iframe");

  if (window.slideTimer) clearTimeout(window.slideTimer);

  if (video) {
    video.currentTime = 0;
    video.play().catch(() => {});
    video.onended = () => swiper.slideNext();
  } else if (iframe) {
    window.slideTimer = setTimeout(() => swiper.slideNext(), 4000);
  } else {
    window.slideTimer = setTimeout(() => swiper.slideNext(), 3000);
  }
}
