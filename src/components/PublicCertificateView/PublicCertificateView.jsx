import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import CertificateTemplate from "../CertificateTemplate/CertificateTemplate";

const PublicCertificateView = () => {
  const [searchParams] = useSearchParams();
  const [certData, setCertData] = useState(null);
  const [loading, setLoading] = useState(true);

  const cid = searchParams.get("cid");

  useEffect(() => {
    if (cid) {
      const safeCid = encodeURIComponent(cid);

      axios
        .get(
          `https://operating-media-backend.onrender.com/api/certificates/verify/?cid=${safeCid}`,
        )
        .then((res) => {
          setCertData(res.data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [cid]);

  if (loading)
    return <div className="loader-center">Verifying Certificate...</div>;
  if (!certData)
    return <div className="error-center">Certificate Not Found</div>;

  return (
    <div
      style={{ background: "#f1f5f9", minHeight: "100vh", padding: "50px 0" }}
    >
      <CertificateTemplate data={certData} />

      {/* Optional: Add a Print button for the public user */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button onClick={() => window.print()} className="cert-m-new-btn">
          Download / Print Certificate
        </button>
      </div>
    </div>
  );
};

export default PublicCertificateView;
