import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { useUserAuth } from "../context/UserAuthContext";
import React, { useState, useEffect } from "react";
import { db, storage } from "../firebase";
import "./Ads.css";

const Ads = () => {
  const { user } = useUserAuth();
  const [showForm, setShowForm] = useState(false);
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [ads, setAds] = useState([]);
  const [error, setError] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  useEffect(() => {
    const fetchAdsData = async () => {
      try {
        const adsSnapshot = await getDocs(collection(db, "ads"));
        const adsData = adsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAds(adsData);

        localStorage.setItem("adsData", JSON.stringify(adsData));
      } catch (error) {
        console.error("Error fetching ads:", error);
      }
    };

    fetchAdsData();
  }, []);

  useEffect(() => {
    // Get ads data from local storage
    const cachedAdsData = localStorage.getItem("adsData");
    if (cachedAdsData) {
      setAds(JSON.parse(cachedAdsData));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!productName || !description || !price || !image) {
      setError("Please fill in all the fields.");
      return;
    }

    const newAd = {
      productName,
      description,
      price,
      user: {
        uid: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL,
      },
    };

    try {
      const metadata = {
        contentType: "image/jpeg",
      };
      const storageRef = ref(storage, "Ads/" + image.name);
      const uploadTask = uploadBytesResumable(storageRef, image, metadata);

      uploadTask.on(
        "state_changed",
        () => {},
        (error) => {
          console.error("Error uploading image:", error);
        },
        async () => {
          const imageUrl = await getDownloadURL(uploadTask.snapshot.ref);

          const newAdWithImage = {
            ...newAd,
            image: imageUrl,
          };

          try {
            const docRef = await addDoc(collection(db, "ads"), newAdWithImage);
            setAds((prevAds) => [
              ...prevAds,
              { ...newAdWithImage, id: docRef.id },
            ]);
            setProductName("");
            setDescription("");
            setPrice("");
            setImage(null);
            setShowForm(false);
          } catch (error) {
            console.error("Error adding ad to Firestore Database:", error);
            setError("Error, Please try again.");
          }
        }
      );
    } catch (error) {
      console.error("Error uploading image:", error);
      setError("Error uploading image. Please try again.");
    }
  };

  return (
    <div>
      <h2 className="mt-4" style={{ color: "white" }}>
        Ads
      </h2>
      {!showForm ? (
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          Post Ad
        </button>
      ) : (
        <div className="form-container">
          <h3>Post an Ad</h3>
          <form onSubmit={handleSubmit}>
            {error && <div className="error">{error}</div>}
            <div className="form-group">
              <label htmlFor="productName">Product Name</label>
              <input
                type="text"
                id="productName"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                rows="3"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="price">Price</label>
              <input
                type="text"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="image">Product Image</label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
            <div className="button-container">
              <button type="submit" className="btn-primary">
                Submit Ad
              </button>
              <button
                className="btn-secondary"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <h2 className="mt-4" style={{ color: "white" }}>
        Posted Ads
      </h2>
      <div className="ads-container">
        {ads.map((ad, index) => (
          <div key={index} className="ad-card">
            <img src={ad.image} alt={ad.productName} />
            <div className="ad-details">
              <h3>{ad.productName}</h3>
              <p>{ad.description}</p>
              <p>Price: {ad.price}</p>
              <div className="user-info">
                <img src={ad.user.photoURL} alt="User Profile" />
                <span>{ad.user.displayName}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Ads;
