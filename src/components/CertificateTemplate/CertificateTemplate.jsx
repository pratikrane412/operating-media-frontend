import React, { forwardRef } from "react";
import "./CertificateTemplate.css";

const CertificateTemplate = forwardRef(({ data }, ref) => {
  if (!data) return null;

  return (
    <div className="cert-final-container" ref={ref}>
      {/* THE BLANK TEMPLATE IMAGE */}
      <img src="/OM Certificate 2026.png" alt="Template" className="cert-final-bg" />

      {/* 1. TOP SECTION */}
      <p className="txt-certify">This certifies that</p>
      <h1 className="txt-name">{data.name}</h1>
      <p className="txt-completion">
        has completed the required course of study <br />
        for the below mentioned topic and <br />
        in testimony thereof is awarded this
      </p>

      {/* 2. COURSE SECTION */}
      <h2 className="txt-course">{data.course}</h2>
      <p className="txt-date">given in the month of {data.date}</p>

      {/* 3. PERFORMANCE RATING (Left) */}
      <div className="box-rating-val">{data.rating} / 10</div>
      <div className="box-rating-label">Performance Rating</div>

      {/* 4. SIGNATURE LABEL (Right) */}
      <div className="box-signature-label">Harsh Pareek, Director</div>

      {/* 5. FOOTER TEXTS */}
      <div className="footer-left">Powered by iBraine Digital LLP</div>
      <div className="footer-mid">Certificate ID - {data.certificate_id}</div>
      <div className="footer-right">www.OperatingMedia.com</div>
    </div>
  );
});

export default CertificateTemplate;
