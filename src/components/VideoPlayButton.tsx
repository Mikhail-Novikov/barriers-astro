/**
 * VideoPlayButton component
 *
 * @param props - Component properties.
 * @param props.onClick - Click handler for the play button.
 * @param props.visibility - Whether the icon is visible on hover or always.
 * @returns {JSX.Element} The VideoPlayButton component.
 */
type VideoPlayButtonProps = {
  onClick?: React.MouseEventHandler<HTMLSpanElement>;
  visibility?: 'hover' | 'always' | 'hidden';
};

export default function VideoPlayButton({ onClick, visibility = 'hover' }: VideoPlayButtonProps): JSX.Element | null {
  if (visibility === 'hidden') {
    return null;
  }

  const isAlwaysVisible = visibility === 'always';

  return (
    <span
      className={`perco-icons absolute inset-0 flex items-center justify-center text-[60px] cursor-pointer ${isAlwaysVisible ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
      onClick={onClick}
    >
      <i className="perco-icon-play" />
    </span>
  );
}
