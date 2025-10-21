'use client';

export default function PrintButton({ className }: { className?: string }) {
  return (
    <button
      className={className}
      onClick={() => {
        window.print();
      }}
    >
      Looks good → Generate
    </button>
  );
}
