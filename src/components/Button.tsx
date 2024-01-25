import {forwardRef} from 'react';
import React from "react";
import { VariantProps, cva } from "class-variance-authority";
import { cn } from '../util/utils';

const buttonVariants = cva(
  "block cursor-pointer",
  {
    variants: {
      variant: {
        default: 'bg-black text-white hover:bg-gray-600',
        outline: 'bg-white border-2 border-black hover:bg-gray-100',
        blueContainer: 'bg-blue-600 text-white hover:bg-blue-700',
        blueOutline: 'bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-100',
        warning: 'bg-yellow-400 text-white hover:bg-yellow-300',
        danger: 'bg-red-600 text-white hover:bg-red-500',
        light: 'bg-transparent border-[1px] border-gray-300 hover:bg-gray-100',
        ghost: 'bg-transparent',
        grey: 'bg-gray-300 hover:bg-gray-400',
        green: 'bg-green-900 hover:bg-green-700 text-white',
        completed: 'bg-green-700 hover:bg-green-600 text-white',
        white: 'bg-white text-gray-950 hover:bg-gray-200'
      },
      size: {
        default: 'px-6 py-2',
        sm: 'px-4 py-1',
        lg: 'px-10 py-4',
        lengthen: 'px-20 py-2',
      },
      font: {
        default: 'font-normal',
        md: 'font-medium',
        semibold: 'font-semibold',
        bold: 'font-bold'
      },
      rounded: {
        default: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        strong: 'rounded-2xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      rounded: 'default',
      font: "default",
    }
  }
)

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants>{
  children: any,
  type?: 'button' | 'submit', 
  disabled?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({className, size, variant, rounded, type, font, disabled = false, ...props}, ref) => {
  return (
    <button 
      disabled={disabled} 
      ref={ref} 
      type={type}
      className={cn(buttonVariants({variant, size, rounded, font, className}), {
        "select-none !bg-gray-300 cursor-auto disabled:pointer-events-none": disabled == true
      })} {...props}>
    </button>
  )
})

export { Button, buttonVariants }