import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge, twMerge } from 'tailwind-merge'
// Define the types of clsx and twMerge
type ClsxFunction = (...classes: ClassValue[]) => string
type TwMergeFunction = (classes: string) => string

// Cast the imported functions to the correct types
const typedClsx = clsx as ClsxFunction
const typedTwMerge = twMerge as TwMergeFunction

export function cn(...inputs: ClassValue[]): string {
  return typedTwMerge(typedClsx(...inputs))
}

export const customTwMerge = extendTailwindMerge({
  prefix: 'tw-'
})

// Create a custom tailwindMerge function with the configuration

export function cn_new(...inputs: ClassValue[]): string {
  const prefixedClasses = typedClsx(...inputs)
  return customTwMerge(prefixedClasses)
}
