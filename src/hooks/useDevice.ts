import { useEffect, useState } from "react";

type DeviceInfo = {
  // Флаг, указывающий, является ли устройство мобильным.
  isMobile: boolean;
  // Флаг, указывающий, является ли устройство десктопным.
  isDesktop: boolean;
  // Флаг, указывающий, является ли экран устройства ретина-дисплеем.
  isRetina: boolean;
};

/**
 * Хук для определения типа устройства (мобильное, десктопное) и плотности экрана (ретина).
 *
 * @returns {DeviceInfo} Объект с информацией о типе устройства и плотности экрана.
 */
const getDeviceInfo = (): DeviceInfo => {
  const isMobile = window.matchMedia("(max-width: 600px)").matches;

  return {
    isMobile,
    isDesktop: !isMobile,
    isRetina: window.devicePixelRatio >= 2,
  };
};

/**
 * Хук для получения информации о типе устройства и плотности экрана.
 *
 * @returns {DeviceInfo} Объект с информацией о типе устройства и плотности экрана.
 */
export const useDevice = (): DeviceInfo => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isDesktop: true,
    isRetina: false,
  });

  useEffect(() => {
    const updateDeviceInfo = () => setDeviceInfo(getDeviceInfo());

    updateDeviceInfo();
    window.addEventListener("resize", updateDeviceInfo);
    return () => window.removeEventListener("resize", updateDeviceInfo);
  }, []);

  return deviceInfo;
};
