const TextHighlighting = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <em className="bg-base not-italic">
      {children}
    </em>
  );
}

export default TextHighlighting;