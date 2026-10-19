import type { CSSProperties } from 'react';

/**
 * Пропсы слайдера выбора ширины проезда.
 */
type WidthSliderProps = {
  /** Текущее значение ширины проезда. */
  value: number;
  /** Максимально допустимая ширина проезда. */
  max: number;
  /** Вызывается при изменении значения слайдера. */
  onChange: (value: number) => void;
};

/**
 * Отображает слайдер выбора максимальной ширины проезда.
 *
 * @param props - Текущее значение, предел и обработчик изменения.
 * @returns Слайдер ширины с минимальным, текущим и максимальным значениями.
 */
export default function WidthSlider({ value, max, onChange }: WidthSliderProps): JSX.Element {
  const sliderPercentage = `${(value / max) * 100}%`;
  const isLimited = value < 0.1 || value > max - 0.1;
  const trackClasses = [
    'width-slider-track',
    value === 0 && 'width-slider-track--min',
    value === max && 'width-slider-track--max',
    isLimited && 'width-slider-track--limited',
  ].filter(Boolean).join(' ');

  return (
    <div className="width-slider">
      <div
        className={trackClasses}
        style={{ '--slider-percentage': sliderPercentage } as CSSProperties}
      >
        <div className="width-slider-pattern" />
        <input
          className="width-slider-input"
          type="range"
          name="width"
          min="0"
          max={max}
          step="0.1"
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          aria-label="Максимальная ширина проезда"
        />
      </div>
      <div className="width-slider-labels">
        <span className="width-slider-label-min">0</span>
        <span
          className={`width-slider-value${isLimited ? ' is-hidden' : ''}`}
          style={{ left: sliderPercentage }}
        >
          {value.toLocaleString('ru-RU', { maximumFractionDigits: 1 })}
        </span>
        <span className="width-slider-label-max">{max}</span>
      </div>
    </div>
  );
}
