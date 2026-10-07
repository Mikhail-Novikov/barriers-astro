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
  // Режим видимости иконки воспроизведения: по наведению, постоянно или скрыта.
  playButtonVisibility?: 'hover' | 'always' | 'hidden';
  caption?: string;
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
  { src, poster, caption, containerClassName = "", showFullscreen = true, playButtonVisibility = 'hover', ...props },
  ref,
) {
  const [videoKey, setVideoKey] = useState(0);
  const items = useMemo(() => [{ src, poster }], [src, poster]);

  useEffect(() => {
    if (!props.autoPlay) return;

    const handleGalleryClose = () => setVideoKey((key) => key + 1);
    document.addEventListener("fancybox:destroy", handleGalleryClose);
    return () => document.removeEventListener("fancybox:destroy", handleGalleryClose);
  }, [props.autoPlay]);

  const { galleryRef, openGallery } = useLightGallery({
    items,
    selector: 'a[data-fancybox="video-player"]',
    showFullscreen,
    videoAutoplay: true,
    controls: false,
    mainClass: 'hero-video',
  });

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
            data-caption={caption}
            aria-hidden="true"
            tabIndex={-1}
          />
          <VideoPlayButton onClick={handleOpenGallery} visibility={playButtonVisibility} />
        </>
      )}
    </div>
  );
});

export default Video;