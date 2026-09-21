/**
 * VideoPlayButton component
 *
 * @param props - Component properties.
 * @param props.onClick - Click handler for the play button.
 * @returns {JSX.Element} The VideoPlayButton component.
 */
type VideoPlayButtonProps = {
  onClick?: React.MouseEventHandler<HTMLSpanElement>;
};

export default function VideoPlayButton({ onClick }: VideoPlayButtonProps): JSX.Element {
  return (
    <span
      className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/10"
      onClick={onClick}
    >
      <span className="flex size-16 items-center justify-center rounded-full bg-white/90 text-grey-1000 opacity-0 shadow-sm transition-opacity duration-300 group-hover:opacity-100">
        <span className="ml-1 block h-0 w-0 border-y-[9px] border-y-transparent border-l-[13px] border-l-grey-1000" />
      </span>
    </span>
  );
}
