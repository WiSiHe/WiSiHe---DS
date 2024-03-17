import { cn } from "@wisihe/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "tertiary";
  size?: "small" | "medium" | "large";
}

export function Button({
  children,
  variant = "primary",
  size = "medium",
  ...other
}: ButtonProps): JSX.Element {
  const buttonColor = {
    primary: "bg-blue-500 hover:bg-blue-700",
    secondary: "bg-gray-500 hover:bg-gray-700",
    tertiary: "bg-white hover:bg-gray-100",
  }[variant];

  const buttonSize = {
    small: "px-2 py-1 text-sm",
    medium: "px-4 py-2 text-base",
    large: "px-6 py-3 text-lg",
  }[size];

  return (
    <button className={cn(buttonColor, buttonSize)} type="button" {...other}>
      {children}
    </button>
  );
}

Button.displayName = "Button";
