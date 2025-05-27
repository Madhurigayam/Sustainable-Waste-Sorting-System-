import React, { useState } from "react";
import axios from "axios";
import "../styles.css";

const recyclingInfo = {
  cardboard: { recyclable: true, methods: ["Recycled into new cardboard products", "Used for composting", "Reused for packaging"] },
  glass: { recyclable: true, methods: ["Melted to create new glass products", "Crushed into sand for construction", "Reused for decoration"] },
  metal: { recyclable: true, methods: ["Melted and repurposed into new metal items", "Used in construction materials", "Recycled into cans and wires"] },
  paper: { recyclable: true, methods: ["Recycled into new paper products", "Used for composting", "Upcycled into crafts"] },
  plastic: { recyclable: "Depends on type", methods: ["Recycled into plastic products", "Used for making synthetic fabric", "Converted into fuel in some facilities"] },
  trash: { recyclable: false, methods: ["Can be disposed of in landfills", "Used in waste-to-energy plants"] }
};

const ImageUploader = () => {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!image) {
      alert("Please select an image!");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await axios.post("http://127.0.0.1:5001/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResult(response.data);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to classify image.");
    }
  };

  return (
    <div className="container">
      <h2>♻️ Waste Classification System</h2>
      <input type="file" onChange={handleImageChange} className="file-input" />
      <button onClick={handleUpload} className="upload-btn">Upload & Classify</button>

      {result && (
        <div className="result-card">
          <h3>Prediction Result</h3>
          <p><strong>Category:</strong> {result.category}</p>
          <p><strong>Confidence:</strong> {result.confidence}%</p>

          <div className="recycling-info">
            <h4>♻️ Recyclability:</h4>
            <p>{recyclingInfo[result.category]?.recyclable ? "✅ Yes, this can be recycled!" : "❌ No, this is not recyclable."}</p>
            
            <h4>🔄 Recycling Methods:</h4>
            <ul>
              {recyclingInfo[result.category]?.methods.map((method, index) => (
                <li key={index}>🔹 {method}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
