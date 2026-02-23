import React, { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";

const QRCodeSection = () => {
  const qrRef = useRef(null);

  const downloadQR = () => {
    const canvas = qrRef.current.querySelector("canvas");
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");

    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = "warung-bu-yogi-qr.png";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div className="text-center" ref={qrRef}>
      <QRCodeCanvas
        value="https://warung-sayur.vercel.app"
        size={220}
        bgColor="#ffffff"
        fgColor="#5DBB63"
        level="H"
        includeMargin={true}
      />

      <button
        onClick={downloadQR}
        className="mt-6 bg-[#5DBB63] hover:bg-[#4ca052] text-white px-6 py-2 rounded-xl shadow-md transition"
      >
        Download QR Code
      </button>
    </div>
  );
};

export default QRCodeSection;