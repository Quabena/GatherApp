import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Gallery = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openImage = (index) => {
    setCurrentIndex(index);
    setSelectedImage(images[index]);
  };

  const closeImage = () => {
    setSelectedImage(null);
  };

  const prevImage = () => {
    const newIndex = (currentIndex - 1 + images.length) % images.length;
    setCurrentIndex(newIndex);
    setSelectedImage(images[newIndex]);
  };

  const nextImage = () => {
    const newIndex = (currentIndex + 1) % images.length;
    setCurrentIndex(newIndex);
    setSelectedImage(images[newIndex]);
  };

  return (
    <div className="grid grid-cols-3 gap-2 md:gap-4">
      {images.map((img, index) => (
        <motion.img
          key={index}
          src={img}
          alt={`Event ${index + 1}`}
          className="w-full h-32 md:h-48 object-cover rounded-lg cursor-pointer"
          whileHover={{ scale: 1.05 }}
          onClick={() => openImage(index)}
        />
      ))}

      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <button
            className="absolute top-4 right-4 text-white text-2xl"
            onClick={closeImage}
          >
            <FaTimes />
          </button>
          <button
            className="absolute left-4 text-white text-2xl"
            onClick={prevImage}
          >
            <FaChevronLeft />
          </button>
          <motion.img
            src={selectedImage}
            alt="Selected"
            className="max-w-full max-h-[90vh] rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />
          <button
            className="absolute right-4 text-white text-2xl"
            onClick={nextImage}
          >
            <FaChevronRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default Gallery;
