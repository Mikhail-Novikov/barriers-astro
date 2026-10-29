import { forwardRef, useEffect, useMemo, useRef, useState, type VideoHTMLAttributes } from "react";
import { useLightGallery } from "@hooks/useLightGallery";
import VideoPlayButton from "@components/VideoPlayButton";

type VideoProps = VideoHTMLAttributes<HTMLVideoElement> & {
  // Исходный URL видео.
  src: string;
  // URL постера для видео.
  containerClassName?: string;
  // Показать ли опцию полноэкранного режима в light gallery.
  showFullscreen?: boolean;
  // Запускать видео в контейнере вместо открытия light gallery.
  inlinePlayback?: boolean;
  // Режим видимости иконки воспроизведения: по наведению, постоянно или скрыта.
  playButtonVisibility?: 'hover' | 'always' | 'hidden';
  // Альтернативный текст для видео.
  caption?: string;
};

/**
 * Компонент для отображения видео с возможностью открытия в полноэкранном режиме через light gallery.
 *
 * @param props - Свойства компонента.
 * @param props.src - Исходный URL видео.
 * @param props.poster - URL постера для видео.
 * @param props.containerClassName - Дополнительные классы для контейнера.
 * @param props.showFullscreen - Показать ли опцию полноэкранного режима.
 * @param props.inlinePlayback - Запускать видео в контейнере по кнопке воспроизведения.
 * @returns {JSX.Element} Компонент Video.
 */
const Video = forwardRef<HTMLVideoElement, VideoProps>(function Video(
  {
    src,
    poster,
    caption,
    containerClassName = "",
    showFullscreen = true,
    inlinePlayback = false,
    playButtonVisibility = 'hover',
    autoPlay,
    controls,
    onPlay,
    onEnded,
    ...props
  },
  ref,
) {
  const [videoKey, setVideoKey] = useState(0);
  const [isPlayingInline, setIsPlayingInline] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const items = useMemo(() => [{ src, poster }], [src, poster]);

  useEffect(() => {
    if (!autoPlay) return;

    const handleGalleryClose = () => setVideoKey((key) => key + 1);
    document.addEventListener("fancybox:destroy", handleGalleryClose);
    return () => document.removeEventListener("fancybox:destroy", handleGalleryClose);
  }, [autoPlay]);

  const { galleryRef, openGallery } = useLightGallery({
    items,
    selector: 'a[data-fancybox="video-player"]',
    showFullscreen,
    videoAutoplay: true,
    controls: false,
    mainClass: 'hero-video',
  });

  // Обработчик клика по кнопке воспроизведения для открытия light gallery.
  const handleOpenGallery = () => {
    openGallery(0);
  };

  // Обработчик клика по кнопке воспроизведения для воспроизведения видео в контейнере.
  const handlePlayInline = () => {
    const video = videoRef.current;
    if (video) {
      void video.play().catch((error: unknown) => {
        console.error("Failed to start inline video playback.", error);
      });
    }
  };

  // Обработчик клика по видео для воспроизведения в контейнере.
  const handleInlineVideoClick = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      handlePlayInline();
    } else {
      video.pause();
    }
  };

  // Обработчик рефа видео.
  const handleVideoRef = (video: HTMLVideoElement | null) => {
    videoRef.current = video;
    if (typeof ref === "function") {
      ref(video);
    } else if (ref) {
      ref.current = video;
    }
  };

  return (
    <div
      ref={galleryRef}
      className={`group relative ${containerClassName}`}
    >
      <video
        key={videoKey}
        ref={handleVideoRef}
        src={src}
        {...props}
        poster={poster}
        autoPlay={inlinePlayback ? false : autoPlay}
        controls={inlinePlayback ? false : controls}
        onClick={inlinePlayback ? handleInlineVideoClick : undefined}
        onPlay={(event) => {
          if (inlinePlayback) setIsPlayingInline(true);
          onPlay?.(event);
        }}
        onPause={(event) => {
          if (inlinePlayback) setIsPlayingInline(false);
          props.onPause?.(event);
        }}
        onEnded={(event) => {
          if (inlinePlayback) setIsPlayingInline(false);
          onEnded?.(event);
        }}
      />
      {showFullscreen && !inlinePlayback && (
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
      )}
      {inlinePlayback ? (
        <VideoPlayButton
          onClick={handlePlayInline}
          visibility={isPlayingInline ? 'hidden' : 'always'}
        />
      ) : (
        showFullscreen && (
          <VideoPlayButton onClick={handleOpenGallery} visibility={playButtonVisibility} />
        )
      )}
    </div>
  );
});

export default Video;