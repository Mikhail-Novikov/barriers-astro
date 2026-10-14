import { useEffect, useState } from 'react';

type Breakpoint = 'mobile' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';

interface BreakpointValue {
  mobile: boolean;
  xs: boolean;
  sm: boolean;
  md: boolean;
  lg: boolean;
  xl: boolean;
  '2xl': boolean;
  '3xl': boolean;
  '4xl': boolean;
}

// Tailwind breakpoints
const breakpoints = {
  mobile: 280,
  xs: 320,
  sm: 600,
  md: 712,
  lg: 1019,
  xl: 1200,
  '2xl': 1400,
  '3xl': 1600,
  '4xl': 1920,
};

const matchesBreakpoint = (breakpoint: Breakpoint): boolean =>
  window.matchMedia(`(min-width: ${breakpoints[breakpoint]}px)`).matches;

/**
 * Хук для определения текущего breakpoint экрана
 * @returns Объект с булевыми значениями для каждого breakpoint
 * 
 * @example
 * const screen = useBreakpoint();
 * if (screen.md) {
 *   return <DesktopComponent />;
 * }
 * return <MobileComponent />;
 */
export const useBreakpoint = (): BreakpointValue => {
  const [breakpoint, setBreakpoint] = useState<BreakpointValue>({
    mobile: true,
    xs: false,
    sm: false,
    md: false,
    lg: false,
    xl: false,
    '2xl': false,
    '3xl': false,
    '4xl': false,
  });

  useEffect(() => {
    const handleResize = () => {
      setBreakpoint({
        mobile: matchesBreakpoint('mobile'),
        xs: matchesBreakpoint('xs'),
        sm: matchesBreakpoint('sm'),
        md: matchesBreakpoint('md'),
        lg: matchesBreakpoint('lg'),
        xl: matchesBreakpoint('xl'),
        '2xl': matchesBreakpoint('2xl'),
        '3xl': matchesBreakpoint('3xl'),
        '4xl': matchesBreakpoint('4xl'),
      });
    };

    // Вызываем сразу при монтировании
    handleResize();

    // Добавляем слушатель изменения размера окна
    window.addEventListener('resize', handleResize);

    // Очищаем слушатель при размонтировании
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return breakpoint;
};

/**
 * Хук для получения текущего breakpoint как строки
 * @returns Текущий breakpoint: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
 * 
 * @example
 * const currentBreakpoint = useCurrentBreakpoint();
 * console.log(currentBreakpoint); // 'md'
 */
export const useCurrentBreakpoint = (): Breakpoint => {
  const [current, setCurrent] = useState<Breakpoint>('xs');

  useEffect(() => {
    const handleResize = () => {
      let breakpoint: Breakpoint = 'xs';

      if (matchesBreakpoint('4xl')) breakpoint = '4xl';
      else if (matchesBreakpoint('3xl')) breakpoint = '3xl';
      else if (matchesBreakpoint('2xl')) breakpoint = '2xl';
      else if (matchesBreakpoint('xl')) breakpoint = 'xl';
      else if (matchesBreakpoint('lg')) breakpoint = 'lg';
      else if (matchesBreakpoint('md')) breakpoint = 'md';
      else if (matchesBreakpoint('sm')) breakpoint = 'sm';
      else if (matchesBreakpoint('xs')) breakpoint = 'xs';

      setCurrent(breakpoint);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return current;
};
