import React from "react";

function SectionRounded({
  children,
  title,
  className,
}: {
  children: React.ReactNode;
  title?: string;
  className?: string;
}) {
  return (
    <div className={`rounded-3xl bg-gradient-radial px-6 py-6 ${className}`}>
      {title && <h3 className="mb-2 text-center text-xl">{title}</h3>}
      {children}
    </div>
  );
}

export default SectionRounded;
