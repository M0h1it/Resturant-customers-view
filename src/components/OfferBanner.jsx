import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export default function OfferBanner() {

  const [banners, setBanners] = useState([]);
  const [deviceId] = useState(localStorage.getItem("DEVICE_TABLE") || "");
  const [loading, setLoading] = useState(true);

  const normalizeFileType = (type) => {
    if (!type) return "static_image";
    const t = type.toLowerCase();
    if (t === "tamplate") return "html";
    return t;
  };

  useEffect(() => {
    fetchBanner();
  }, []);

  const fetchBanner = async () => {
    try {
      const res = await fetch(
        "https://edcloud.experiences.digital/api/get-schedule-data",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ device_id: deviceId }),
        }
      );

      const data = await res.json();
      console.log("Offer Banner API RESPONSE:", data);

      if (data.code === 200 && Array.isArray(data.data)) {
        setBanners(data.data);
      } else {
        setBanners([]);
      }
    } catch (error) {
      console.log("Banner API ERROR:", error);
      setBanners([]);
    }

    setLoading(false);
  };

  if (loading) {
    return <div className="text-center small">Loading offers...</div>;
  }

  if (!banners || banners.length === 0) {
    return <div className="text-center small">No offers available</div>;
  }

  const isSingle = banners.length === 1;

  return (
    <div style={{ height: "150px", width: "100%" }}>

      {isSingle ? (
        <BannerItem file={banners[0]} normalizeFileType={normalizeFileType} />
      ) : (
        <Swiper
          modules={[Pagination]}
          pagination={{ clickable: true }}
          loop={true}
          autoplay={true}
          style={{ height: "150px" }}
        >
          {banners.map((file, idx) => (
            <SwiperSlide key={idx}>
              <BannerItem file={file} normalizeFileType={normalizeFileType} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}

function BannerItem({ file, normalizeFileType }) {
  const type = normalizeFileType(file.file_type);

  return (
    <div style={{ width: "100%", height: "120px", overflow: "hidden", borderRadius: "12px" }}>
      {type === "static_image" || type === "gif" ? (
        <img src={file.file_path} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : type === "video" ? (
        <video
          src={file.file_path}
          autoPlay
          muted
          loop
          playsInline
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        ></video>
      ) : (
        <iframe
          src={file.file_path}
          style={{ width: "100%", height: "120px", border: "none" }}
        ></iframe>
      )}
    </div>
  );
}
