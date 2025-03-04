'use client';

export default function Container({ children }) {
  return (
    <div className="relative border-4 border-[#ffd700] shadow-[0_0_0_4px_#ff69b4,0_0_0_8px_#ffd700] max-w-screen-md w-[95%] mx-auto my-4 p-4 sm:p-6 h-[90%] overflow-visible">
      {children}
    </div>
  );
}
