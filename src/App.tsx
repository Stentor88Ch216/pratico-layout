import "./styles.css";
import { useState, useLayoutEffect, useRef, useEffect } from "react";

export default function App() {
  const [num, setNum] = useState(5);
  const [selectedMiniature, setSelectedMiniature] = useState(0); // index

  const canvasRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const mainContainerRef = useRef<HTMLDivElement>(null);

  function scrollCarouselMax() {
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.scrollLeft = carousel.scrollWidth - carousel.clientWidth;
    }
  }

  useLayoutEffect(() => {
    scrollCarouselMax();
  }, [num]);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const mainContainer = mainContainerRef.current;

    function checkAspectRatio() {
      if (canvas && canvas.parentElement) {
        const parent = canvas.parentElement;
        const parentAspectRatio = parent.offsetWidth / parent.offsetHeight;

        if (parentAspectRatio > 16 / 9) {
          canvas.style.width = "auto";
          canvas.style.height = "100%";
        } else {
          canvas.style.width = "100%";
          canvas.style.height = "auto";
        }
      }

      if (mainContainer) {
        // This is du to an issue on macOS
        // When resizing from the bottom, the vh property is not updated
        // -TODO: Maybe later it won't be the window size but parent size
        mainContainer.style.height = `${window.innerHeight}px`;
      }

      scrollCarouselMax();
    }

    // Initial check
    checkAspectRatio();
    // Attach the resize event listener
    window.addEventListener("resize", checkAspectRatio);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", checkAspectRatio);
    };
  });

  return (
    <div className="App">
      <div className="mainContainer">
        <div className="canvasContainer">
          <div className="canvas" ref={canvasRef}>
            <div className="buttonsContainer">
              <button onClick={() => setNum(num - 1)}> - </button>
              <p>{num}</p>
              <button onClick={() => setNum(num + 1)}> + </button>
            </div>
          </div>
        </div>

        <div className="carouselContainer">
          <div className="carousel" ref={carouselRef}>
            {Array.from({ length: num }).map((_, index) => (
              <div className="miniature" key={index}>
                {index + 1}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
