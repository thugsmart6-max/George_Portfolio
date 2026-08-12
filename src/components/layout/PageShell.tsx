type Props = {
  children: React.ReactNode;
  wide?: boolean;
};

/** Editorial page frame — consistent advanced spacing across all routes. */
export function PageShell({ children, wide = false }: Props) {
  return (
    <div className="relative min-h-screen">
      <div
        className={`relative z-10 mx-auto px-4 pb-24 pt-24 sm:px-5 sm:pb-32 sm:pt-28 md:px-10 md:pt-36 ${
          wide ? "max-w-[1500px]" : "max-w-[1400px]"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
