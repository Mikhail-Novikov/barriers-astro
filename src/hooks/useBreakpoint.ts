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
  mobile: 300,
  xs: 320,
  sm: 500,
  md: 900,
  lg: 1250,
  xl: 1400,
  '2xl': 1600,
  '3xl': 1920,
  '4xl': 2560,
};

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
      const width = window.innerWidth;

      setBreakpoint({
        mobile: width >= breakpoints.mobile,
        xs: width >= breakpoints.xs,
        sm: width >= breakpoints.sm,
        md: width >= breakpoints.md,
        lg: width >= breakpoints.lg,
        xl: width >= breakpoints.xl,
        '2xl': width >= breakpoints['2xl'],
        '3xl': width >= breakpoints['3xl'],
        '4xl': width >= breakpoints['4xl'],
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
      const width = window.innerWidth;
      let breakpoint: Breakpoint = 'xs';

      if (width >= breakpoints['4xl']) breakpoint = '4xl';
      else if (width >= breakpoints['3xl']) breakpoint = '3xl';
      else if (width >= breakpoints['2xl']) breakpoint = '2xl';
      else if (width >= breakpoints.xl) breakpoint = 'xl';
      else if (width >= breakpoints.lg) breakpoint = 'lg';
      else if (width >= breakpoints.md) breakpoint = 'md';
      else if (width >= breakpoints.sm) breakpoint = 'sm';
      else if (width >= breakpoints.xs) breakpoint = 'xs';

      setCurrent(breakpoint);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return current;
};
