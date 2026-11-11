import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  advanceScrollPosition,
  closestCopyIndex,
  middleCopyIndex,
  nearestSlideIndex,
  wrapIndex,
} from "../carousel-loop";

type Slide = { id: string; label: string; content: ReactNode; style?: CSSProperties };
type Props = {
  id: string;
  label: string;
  itemLabel: string;
  slides: Slide[];
  slideClassName: string;
  className?: string;
  toolbarNote: string;
};

export default function InfiniteCarousel({
  id,
  label,
  itemLabel,
  slides,
  slideClassName,
  className = "",
  toolbarNote,
}: Props) {
  const count = slides.length;
  const trackRef = useRef<HTMLDivElement>(null);
  const targetIndexRef = useRef(count);
  const activeIndexRef = useRef(0);
  const movingRef = useRef(false);
  const autoScrollingRef = useRef(false);
  const scrollTimerRef = useRef<number | undefined>(undefined);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);
  const autoPlaying = !paused && !interacting && !focused && !hidden && !reducedMotion && count > 1;

  const getNearestIndex = useCallback(() => {
    const track = trackRef.current;
    if (!track) return count;
    const centers = Array.from(track.children, (child) => {
      const slide = child as HTMLElement;
      return slide.offsetLeft + slide.offsetWidth / 2;
    });
    return nearestSlideIndex(centers, track.scrollLeft + track.clientWidth / 2);
  }, [count]);

  const centerOn = useCallback((index: number, behavior: ScrollBehavior = "auto") => {
    const track = trackRef.current;
    const slide = track?.children[index] as HTMLElement | undefined;
    if (!track || !slide) return;
    targetIndexRef.current = index;
    track.scrollTo({
      left: slide.offsetLeft - (track.clientWidth - slide.offsetWidth) / 2,
      behavior:
        behavior === "auto"
          ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "instant"
            : "smooth"
          : behavior,
    });
  }, []);

  const finishScroll = useCallback(() => {
    if (autoScrollingRef.current && !movingRef.current) return;
    window.clearTimeout(scrollTimerRef.current);
    scrollTimerRef.current = undefined;
    const track = trackRef.current;
    if (!track) return;
    const nearest = getNearestIndex();
    const middle = middleCopyIndex(nearest, count);
    if (nearest !== middle) {
      const from = track.children[nearest] as HTMLElement;
      const to = track.children[middle] as HTMLElement;
      // Identical copies have identical widths. Preserve the exact viewport position
      // while relocating to the middle copy, so the next swipe has room in either direction.
      track.scrollTo({
        left: track.scrollLeft + to.offsetLeft - from.offsetLeft,
        behavior: "instant",
      });
    }
    targetIndexRef.current = middle;
    movingRef.current = false;
  }, [count, getNearestIndex]);

  const markInteraction = () => {
    movingRef.current = true;
    window.clearTimeout(scrollTimerRef.current);
    scrollTimerRef.current = window.setTimeout(finishScroll, 200);
  };

  const move = useCallback(
    (direction: number) => {
      let next = targetIndexRef.current + direction;
      if (next < 0 || next >= count * 3) {
        finishScroll();
        next = targetIndexRef.current + direction;
      }
      movingRef.current = true;
      centerOn(next);
    },
    [centerOn, count, finishScroll],
  );

  const showImage = (index: number) => {
    movingRef.current = true;
    centerOn(closestCopyIndex(index, targetIndexRef.current, count));
  };

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    centerOn(count, "instant");
    const resizeObserver = new ResizeObserver(() => {
      movingRef.current = false;
      centerOn(count + activeIndexRef.current, "instant");
    });
    resizeObserver.observe(track);
    return () => {
      resizeObserver.disconnect();
      window.clearTimeout(scrollTimerRef.current);
    };
  }, [centerOn, count]);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(preference.matches);
    const updateVisibility = () => setHidden(document.hidden);
    updatePreference();
    updateVisibility();
    preference.addEventListener("change", updatePreference);
    document.addEventListener("visibilitychange", updateVisibility);
    return () => {
      preference.removeEventListener("change", updatePreference);
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  useEffect(() => {
    const endInteraction = () => setInteracting(false);
    window.addEventListener("pointerup", endInteraction);
    window.addEventListener("pointercancel", endInteraction);
    return () => {
      window.removeEventListener("pointerup", endInteraction);
      window.removeEventListener("pointercancel", endInteraction);
    };
  }, []);

  useEffect(() => {
    if (!autoPlaying) return;
    const track = trackRef.current;
    if (!track) return;
    autoScrollingRef.current = true;
    let frame: number;
    let previousTime: number | undefined;
    let position = track.scrollLeft;

    const scroll = (time: number) => {
      const elapsed = previousTime === undefined ? 0 : Math.min(time - previousTime, 80);
      previousTime = time;
      if (movingRef.current) {
        position = track.scrollLeft;
      } else {
        const first = track.children[count] as HTMLElement;
        const nextCopy = track.children[count * 2] as HTMLElement;
        const loopStart = first.offsetLeft - (track.clientWidth - first.offsetWidth) / 2;
        position = advanceScrollPosition(
          position,
          elapsed,
          loopStart,
          nextCopy.offsetLeft - first.offsetLeft,
        );
        // Keep fractional pixels in the accumulator for a consistent speed on every display.
        track.scrollTo({ left: position, behavior: "instant" });
      }
      frame = window.requestAnimationFrame(scroll);
    };

    frame = window.requestAnimationFrame(scroll);
    return () => {
      window.cancelAnimationFrame(frame);
      autoScrollingRef.current = false;
    };
  }, [autoPlaying, count]);

  return (
    <div
      className={`infinite-carousel ${className}`}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onPointerDownCapture={() => {
        markInteraction();
        setInteracting(true);
      }}
      onWheelCapture={markInteraction}
      onFocusCapture={(event) => setFocused(event.target.matches(":focus-visible"))}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
      }}
    >
      <div className="gallery-toolbar">
        <p>{toolbarNote}</p>
        <div className="gallery-controls">
          <button
            type="button"
            className="gallery-arrow"
            aria-label={`Previous ${itemLabel}`}
            aria-controls={id}
            onClick={() => move(-1)}
          >
            <span aria-hidden="true">←</span>
          </button>
          <span
            className="gallery-count"
            aria-live={autoPlaying ? "off" : "polite"}
            aria-atomic="true"
          >
            <span className="sr-only">{itemLabel} </span>
            {String(activeIndex + 1).padStart(2, "0")} / {count}
          </span>
          <button
            type="button"
            className="gallery-arrow"
            aria-label={`Next ${itemLabel}`}
            aria-controls={id}
            onClick={() => move(1)}
          >
            <span aria-hidden="true">→</span>
          </button>
          <button
            type="button"
            className="carousel-playback"
            aria-label={`${paused ? "Resume" : "Pause"} automatic scrolling`}
            aria-pressed={paused}
            onClick={() => {
              if (paused) setFocused(false);
              setPaused((value) => !value);
            }}
          >
            <span aria-hidden="true">{paused ? "▶" : "Ⅱ"}</span> {paused ? "Play" : "Pause"}
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        id={id}
        className="carousel-track"
        tabIndex={0}
        aria-label={`${label}. Use the left and right arrow keys to explore.`}
        onScroll={() => {
          const nearest = getNearestIndex();
          activeIndexRef.current = wrapIndex(nearest, count);
          setActiveIndex(activeIndexRef.current);
          if (!movingRef.current) targetIndexRef.current = nearest;
          if (autoScrollingRef.current && !movingRef.current) return;
          movingRef.current = true;
          window.clearTimeout(scrollTimerRef.current);
          // Fallback for browsers without scrollend; do not rebase mid-animation.
          scrollTimerRef.current = window.setTimeout(finishScroll, 200);
        }}
        onScrollEnd={finishScroll}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            move(event.key === "ArrowLeft" ? -1 : 1);
          } else if (event.key === "Home" || event.key === "End") {
            event.preventDefault();
            showImage(event.key === "Home" ? 0 : count - 1);
          }
        }}
      >
        {[0, 1, 2].flatMap((copy) =>
          slides.map((slide, index) => (
            <div
              key={`${copy}-${slide.id}`}
              className={`infinite-slide ${slideClassName}`}
              style={slide.style}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${count}: ${slide.label}`}
              aria-hidden={copy !== 1 ? true : undefined}
              inert={copy !== 1 ? true : undefined}
            >
              {slide.content}
            </div>
          )),
        )}
      </div>

      <div className="gallery-footer">
        <p>
          Swipe or scroll to explore <span aria-hidden="true">↔</span>
        </p>
        <div className="gallery-dots" role="group" aria-label={`Choose a ${itemLabel}`}>
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              aria-label={`Show ${itemLabel} ${index + 1}: ${slide.label}`}
              aria-current={index === activeIndex ? "true" : undefined}
              aria-controls={id}
              onClick={() => showImage(index)}
            >
              <span />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
