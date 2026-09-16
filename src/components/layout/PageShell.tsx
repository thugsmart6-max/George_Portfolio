type Props = {
  children: React.ReactNode;
  wide?: boolean;
};

/** Editorial page frame — consistent advanced spacing across all routes. */
export function PageShell({ children, wide = false }: Props) {
  return (
    <div className="relative min-h-screen">
      <div
        className={`relative z-10 mx-auto min-w-0 px-4 pb-[calc(8rem+env(safe-area-inset-bottom))] pt-20 sm:px-5 sm:pb-40 sm:pt-24 md:px-10 md:pt-28 ${
          wide ? "max-w-[1500px]" : "max-w-[1400px]"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
