import { forwardRef, useEffect, useMemo, useRef, useState, type VideoHTMLAttributes } from "react";
import { useLightGallery } from "@hooks/useLightGallery";
import { useDevice } from "@hooks/useDevice";
import VideoPlayButton from "@components/VideoPlayButton";

type VideoProps = VideoHTMLAttributes<HTMLVideoElement> & {
  // Общий URL видео для обратной совместимости.
  src?: string;
  // URL видео для десктопа.
  srcDesktop?: string;
  // URL видео для мобильных устройств.
  srcMobile?: string;
  // URL постеров для десктопа, мобильных устройств и экранов высокой плотности.
  posterDesktop?: string;
  posterMobile?: string;
  posterRetina?: string;
  containerClassName?: string;
  // Показать ли опцию полноэкранного режима в light gallery.
  showFullscreen?: boolean;
  // Автоматически открыть видео в полноэкранном режиме light gallery.
  fullscreenAutoStart?: boolean;
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
 * @param props.srcDesktop - URL видео для десктопа.
 * @param props.srcMobile - URL видео для мобильных устройств.
 * @param props.poster - Запасной URL постера для обратной совместимости.
 * @param props.posterDesktop - URL постера для десктопа.
 * @param props.posterMobile - URL постера для мобильных устройств.
 * @param props.posterRetina - URL постера для экранов высокой плотности.
 * @param props.containerClassName - Дополнительные классы для контейнера.
 * @param props.showFullscreen - Показать ли опцию полноэкранного режима.
 * @param props.inlinePlayback - Запускать видео в контейнере по кнопке воспроизведения.
 * @returns {JSX.Element} Компонент Video.
 */
const Video = forwardRef<HTMLVideoElement, VideoProps>(function Video(
  {
    src,
    srcDesktop,
    srcMobile,
    poster,
    posterDesktop,
    posterMobile,
    posterRetina,
    caption,
    containerClassName = "",
    showFullscreen = true,
    fullscreenAutoStart = false,
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
  const [isAutoplayBlocked, setIsAutoplayBlocked] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { isMobile, isRetina } = useDevice();
  const responsiveSrc = isMobile
    ? srcMobile ?? srcDesktop ?? src
    : srcDesktop ?? srcMobile ?? src;
  const desktopPoster = posterDesktop ?? poster;
  const responsivePoster = isMobile
    ? posterMobile ?? (isRetina ? posterRetina : undefined) ?? desktopPoster
    : (isRetina ? posterRetina : undefined) ?? desktopPoster;
  const items = useMemo(
    () => [{ src: responsiveSrc, poster: responsivePoster }],
    [responsiveSrc, responsivePoster],
  );

  useEffect(() => {
    if (!autoPlay) return;

    const handleGalleryClose = () => setVideoKey((key) => key + 1);
    document.addEventListener("fancybox:destroy", handleGalleryClose);
    return () => document.removeEventListener("fancybox:destroy", handleGalleryClose);
  }, [autoPlay]);

  useEffect(() => {
    if (!autoPlay || inlinePlayback) {
      setIsAutoplayBlocked(false);
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    let isActive = true;
    void video.play().then(
      () => {
        if (isActive) setIsAutoplayBlocked(false);
      },
      (error: unknown) => {
        if (!isActive) return;

        if (error instanceof DOMException && error.name === "AbortError") return;

        setIsAutoplayBlocked(true);
        if (!(error instanceof DOMException && error.name === "NotAllowedError")) {
          console.error("Failed to start video autoplay.", error);
        }
      },
    );

    return () => {
      isActive = false;
    };
  }, [autoPlay, inlinePlayback, responsiveSrc, videoKey]);

  const { galleryRef, openGallery } = useLightGallery({
    items,
    selector: 'a[data-fancybox="video-player"]',
    showFullscreen,
    videoAutoplay: true,
    fullscreenAutoStart,
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
        src={responsiveSrc}
        {...props}
        poster={responsivePoster}
        autoPlay={inlinePlayback ? false : autoPlay}
        controls={inlinePlayback ? false : controls}
        onClick={inlinePlayback ? handleInlineVideoClick : undefined}
        onPlay={(event) => {
          setIsAutoplayBlocked(false);
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
          href={responsiveSrc}
          data-fancybox="video-player"
          data-type="html5video"
          data-poster={responsivePoster}
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
        (showFullscreen || isAutoplayBlocked) && (
          <VideoPlayButton
            onClick={isAutoplayBlocked ? handlePlayInline : handleOpenGallery}
            visibility={isAutoplayBlocked ? 'always' : playButtonVisibility}
          />
        )
      )}
    </div>
  );
});

export default Video;