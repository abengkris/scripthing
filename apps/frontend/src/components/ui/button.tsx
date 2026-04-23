import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "default" | "ghost" | "outline" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "default",
  size = "default",
  ...props
}) => (
  <button
    {...props}
    data-variant={variant}
    data-size={size}
    className={`px-4 py-2 rounded hover:opacity-90 disabled:opacity-50 ${props.className || ""}`}
  >
    {children}
  </button>
);
