import { useState, useEffect } from "react";
import { UserImageGalleryProps } from "../types";

export default function EventsImageGallery({
  images,
}: {
  images: UserImageGalleryProps;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const img = new Image();
    if (images && images[currentIndex])
      img.src = `${images[currentIndex].IMAGE_LINK}?random=${Math.random()}`;
    img.onload = () => setLoading(false);
  }, [currentIndex, images]);

  const handleNext = () => {
    if (images) setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrevious = () => {
    if (images)
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? images.length - 1 : prevIndex - 1
      );
  };

  if (!images) {
    return <p>No images available</p>;
  }

  return (
    <div className="flex items-center justify-center w-full h-[100%] ">
      <div className="flex w-full h-full justify-center items-center ">
        {images.length > 0 ? (
          <>
            <button onClick={handlePrevious}>
              <img src="/img/arrowicon.png" className="rotate-90 w-5" />
            </button>
            <div className="relative w-[80%] h-[90%] mx">
              {loading ? (
                <div className="animate-pulse w-full h-full bg-mainClassMatch rounded-lg"></div>
              ) : (
                <img
                  src={`${
                    images[currentIndex]?.IMAGE_LINK
                  }?random=${Math.random()}`}
                  alt={"Imagen"}
                  className="rounded-lg object-cover w-full h-full mx-auto"
                />
              )}
            </div>
            <button onClick={handleNext}>
              <img src="/img/arrowicon.png" className="-rotate-90 w-5" />
            </button>
          </>
        ) : (
          <div className="relative w-[80%] h-[90%]">
            <img
              src="/img/noimage.png"
              className="rounded-lg object-cover w-full h-full"
            />
          </div>
        )}
      </div>
    </div>
  );
}
