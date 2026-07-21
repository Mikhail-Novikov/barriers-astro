import { useEffect, useRef } from 'react';

interface UseIntersectionObserverOptions {
  // По умолчанию элемент считается видимым, когда 20% его площади входит в viewport
  threshold?: number | number[];
  // Без отступов, элемент считается видимым, когда его границы пересекают границы viewport
  rootMargin?: string;
  // Коллбек при входе элемента в viewport
  onIntersect?: (element: Element) => void;
  // Коллбек при выходе элемента из viewport
  onLeave?: (element: Element) => void;
}

/**
 * Хук для наблюдения за элементами при их входе в viewport
 * Автоматически добавляет/удаляет классы для анимации появления
 * 
 * @param options Опции для IntersectionObserver
 * @returns Функция для регистрации элемента с ref
 * 
 * @example
 * const Heroes = () => {
 *   const registerElement = useIntersectionObserver({ threshold: 0.2 });
 *   
 *   return (
 *     <div ref={registerElement} className="opacity-0 transition-all duration-500">
 *       Контент
 *     </div>
 *   );
 * };
 */
export const useIntersectionObserver = (
  options: UseIntersectionObserverOptions = {}
) => {
  const {
    threshold = 0.2,
    rootMargin = '0px',
    onIntersect,
    onLeave,
  } = options;

  const elementsRef = useRef<Element[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Входит в viewport
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', '-translate-y-10');
            onIntersect?.(entry.target);
          } else {
            // Выходит из viewport
            entry.target.classList.remove('opacity-100', 'translate-y-0');
            entry.target.classList.add('opacity-0', '-translate-y-10');
            onLeave?.(entry.target);
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    // Наблюдаем за всеми зарегистрированными элементами
    elementsRef.current.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [threshold, rootMargin, onIntersect, onLeave]);

  // Функция для регистрации элемента
  const registerElement = (el: HTMLElement | null) => {
    if (el && !elementsRef.current.includes(el)) {
      elementsRef.current.push(el);
    }
  };

  return registerElement;
};

/**
 * Хук для работы с массивом ref'ов элементов
 * Более удобен когда нужно отслеживать множество элементов
 * 
 * @param count Количество элементов для отслеживания
 * @param options Опции для IntersectionObserver
 * @returns Объект с массивом refs и функцией для их регистрации
 * 
 * @example
 * const Heroes = () => {
 *   const { refs, setRef } = useIntersectionObserverArray(5, { threshold: 0.2 });
 *   
 *   return (
 *     <>
 *       <div ref={(el) => setRef(0, el)} className="opacity-0 transition-all">Hero 1</div>
 *       <div ref={(el) => setRef(1, el)} className="opacity-0 transition-all">Hero 2</div>
 *     </>
 *   );
 * };
 */
export const useIntersectionObserverArray = (
  count: number,
  options: UseIntersectionObserverOptions = {}
) => {
  const {
    // По умолчанию элемент считается видимым, когда 20% его площади входит в viewport
    threshold = 0.2,
    // Без отступов, элемент считается видимым, когда его границы пересекают границы viewport
    rootMargin = '0px',
    // Коллбек при входе элемента в viewport
    onIntersect,
    // Коллбек при выходе элемента из viewport
    onLeave,
  } = options;

  const refs = useRef<(HTMLDivElement | null)[]>(Array(count).fill(null));
  const animatedRef = useRef<Set<Element>>(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animatedRef.current.has(entry.target)) {
            // Добавляем класс анимации только один раз при входе
            entry.target.classList.add('animate-fade-in-up');
            animatedRef.current.add(entry.target);
            onIntersect?.(entry.target);
          } else if (!entry.isIntersecting && animatedRef.current.has(entry.target)) {
            // Удаляем класс анимации при выходе, чтобы можно было повторить
            entry.target.classList.remove('animate-fade-in-up');
            animatedRef.current.delete(entry.target);
            entry.target.classList.add('opacity-0');
            onLeave?.(entry.target);
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    refs.current.forEach((el) => el && observer.observe(el));

    return () => observer.disconnect();
  }, [threshold, rootMargin, onIntersect, onLeave]);

  const setRef = (index: number, el: HTMLElement | null) => {
    refs.current[index] = el;
  };

  return { refs: refs.current, setRef };
};
