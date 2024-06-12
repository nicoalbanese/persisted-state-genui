export const ChatMessage = ({
  children,
  role,
}: {
  children: React.ReactNode;
  role: string;
}) => {
  return (
    <div className="border-t border-border pt-2">
      <div className="font-semibold uppercase text-xs text-neutral-400">
        {role}
      </div>
      <div>{children}</div>
    </div>
  );
};
