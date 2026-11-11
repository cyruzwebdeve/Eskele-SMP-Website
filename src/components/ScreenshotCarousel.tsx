import type { CSSProperties } from "react";
import { galleryImages } from "../gallery-images";
import InfiniteCarousel from "./InfiniteCarousel";

export default function ScreenshotCarousel() {
  return (
    <InfiniteCarousel
      id="gallery-track"
      label="Life on Eskele screenshots"
      itemLabel="screenshot"
      className="gallery-carousel"
      slideClassName="gallery-slide"
      toolbarNote="FROM OUR WORLDS, WITH LOVE"
      slides={galleryImages.map((shot, index) => ({
        id: shot.src,
        label: shot.title,
        style: { "--image-ratio": shot.width / shot.height } as CSSProperties,
        content: (
          <figure>
            <img
              src={shot.src}
              alt={shot.alt}
              width={shot.width}
              height={shot.height}
              loading="lazy"
              decoding="async"
            />
            <figcaption>
              <span>{String(index + 1).padStart(2, "0")} / ESKELE MOMENTS</span>
              <h3>{shot.title}</h3>
            </figcaption>
          </figure>
        ),
      }))}
    />
  );
}
