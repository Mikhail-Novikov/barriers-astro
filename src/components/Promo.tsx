import { useEffect, useRef, useState } from "react";
import { publicAsset } from "@utils/publicAsset";

export default function Promo() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 600);
    };

    setIsMounted(true);
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isMounted) return;

    video.load();
    video.play().catch(() => {});
  }, [isMobile, isMounted]);

  const src = isMobile
    ? publicAsset("/video/promo/promo-video-mobile.mp4")
    : publicAsset("/video/promo/promo-video.mp4");

  return (
    <section className="relative">
      <video
        ref={videoRef}
        key={src}
        className="w-full h-[340px] max-h-[700px] sm:h-auto sm:min-h-[260px] object-cover"
        muted
        autoPlay
        preload="auto"
        playsInline
        loop
        poster={publicAsset("/img/preview-promo.webp")}
      >
        <source src={src} type="video/mp4" />
      </video>

      <div className="container">
        <div className="h-full absolute top-0 pt-12 xl:pt-18 2xl:pt-21 3xl:pt-[116px] max-w-[500px] text-left text-white">
          <h1 className="text-[38px]/12 xl:text-6xl/14 font-bold">
            Шлагбаумы 
          </h1>
          <ul className="perco-icons flex flex-col gap-y-1 mt-6 xl:mt-8 2xl:mt-12 3xl:mt-14.5 font-manrope-semibold text-lg/5">
            <li>
              <div className="flex gap-x-2 items-center text-[28px]/8 xl:text-3xl/10">
                <i className="perco-icon-ru"></i>
                <p className="text-md/5 2xl:text-lg/5">сделано в России</p>
              </div>
            </li>
            <li>
              <p className="text-md/5 2xl:text-lg/5">
                <span className="text-[28px]/8 xl:text-3xl/10">5 </span>
                лет гарантии
              </p>
            </li>
            <li>
              <p className="text-md/5 2xl:text-lg/5">
                <span className="text-[28px]/8 xl:text-3xl/10">38 </span>
                лет на рынке
              </p>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}