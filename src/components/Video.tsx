import { forwardRef, useEffect, useMemo, useState, type VideoHTMLAttributes } from "react";
import { useLightGallery } from "@hooks/useLightGallery";
import VideoPlayButton from "@components/VideoPlayButton";

type VideoProps = VideoHTMLAttributes<HTMLVideoElement> & {
  // Исходный URL видео.
  src: string;
  // URL постера для видео.
  containerClassName?: string;
  // Показать ли опцию полноэкранного режима в light gallery.
  showFullscreen?: boolean;
};

/**
 * Video component
 *
 * @param props - Component properties.
 * @param props.src - Исходный URL видео.
 * @param props.poster - URL постера для видео.
 * @param props.containerClassName - Дополнительные классы для контейнера.
 * @param props.showFullscreen - Показать ли опцию полноэкранного режима.
 * @returns {JSX.Element} Компонент Video.
 */
const Video = forwardRef<HTMLVideoElement, VideoProps>(function Video(
  { src, poster, containerClassName = "", showFullscreen = true, ...props },
  ref,
) {
  const [videoKey, setVideoKey] = useState(0);
  const items = useMemo(() => [{ src, poster }], [src, poster]);

  useEffect(() => {
    const handleVideoGalleryClose = () => setVideoKey((key) => key + 1);

    document.addEventListener("video-gallery-close", handleVideoGalleryClose);
    return () => document.removeEventListener("video-gallery-close", handleVideoGalleryClose);
  }, []);

  // Обработчик закрытия галереи видео.
  const handleGalleryClose = () => {
    document.dispatchEvent(new Event("video-gallery-close"));
  };

  const { galleryRef, openGallery } = useLightGallery({
    items,
    selector: 'a[data-fancybox="video-player"]',
    showFullscreen,
    onClose: handleGalleryClose,
    videoAutoplay: true,
  });

  // Обработчик открытия галереи видео.
  const handleOpenGallery = () => {
    openGallery(0);
  };

  return (
    <div
      ref={galleryRef}
      className={`group relative ${containerClassName}`}
    >
      <video
        key={videoKey}
        ref={ref}
        src={src}
        {...props}
        poster={poster}
      />
      {showFullscreen && (
        <>
          <a
            className="hidden"
            href={src}
            data-fancybox="video-player"
            data-type="html5video"
            data-poster={poster}
            aria-hidden="true"
            tabIndex={-1}
          />
          <VideoPlayButton onClick={handleOpenGallery} />
        </>
      )}
    </div>
  );
});

export default Video;