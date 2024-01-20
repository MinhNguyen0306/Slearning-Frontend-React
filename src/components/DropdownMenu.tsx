import React, { forwardRef, useEffect, useState } from 'react';
import { ChevronDownIcon } from 'lucide-react';
import { cn } from '../util/utils';
import { VariantProps, cva } from 'class-variance-authority';

const dropdownVariants = cva(
    "relative flex justify-between items-center w-full cursor-pointer px-4",
    {
        variants: {
            variant: {
                default: 'border border-gray-800 rounded-md',
                noneRounded: 'border border-gray-800 rounded-none'
            },
            height: {
                default: 'h-[35px]',
                full: 'h-full'
            }
        },
        defaultVariants: {
            variant: 'default',
            height: 'default'
        }
    }
)

interface DropdownProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof dropdownVariants> {
    dataset: any[],
    label?: string, 
    valueKey: string,
    displayKey: string,
    name: string,
    onChange: (item: any) => void
}

const DropdownMenu = forwardRef<HTMLDivElement, DropdownProps>(
    ({dataset, displayKey, label, onChange, name, valueKey, className, variant, height, ...props}, ref) => {
    const [chosen, setChosen] = useState<string>("")
    const [visible, setVisible] = useState<boolean>(false);

    useEffect(() => {
        const box = document.getElementById(name);
        function handleClickBox(e: MouseEvent) {
            if(box && e.target) {
                const element = e.target as HTMLElement
                if((box.contains(element) || visible) && box.id === name) {
                    setVisible(prev => !prev)
                }
            }
        }

        document.addEventListener('click', handleClickBox)
        return () => {
            document.removeEventListener('click', handleClickBox)
        }
    }, [visible])

    const handleClick = (item: any) => {
        onChange(item[valueKey])
        setChosen(item[displayKey])
    }

    return (
        <div 
            ref={ref} 
            id={name}
            className={cn(dropdownVariants({ className, variant, height }))} {...props}
        >
            <span>
                {chosen === "" ? label ? label : dataset[0][displayKey] : chosen}
            </span>
            <ChevronDownIcon className={cn("block text-gray-700 transition-all duration-500", {
                "rotate-180": visible,
            })}/>
            <div className={cn('absolute w-full top-0 left-0 border-[1px] border-gray-300 bg-white transition-all duration-500',
            "invisible opacity-0 z-50", {
                "top-full mt-1 visible opacity-100": visible,
            })}>
                <ul className='w-full max-h-[10rem] overflow-y-scroll scrollbar-hide flex flex-col list-none z-[9999]'>
                    {
                        dataset && dataset.length > 0 && dataset.map((data, index) => (
                            <li 
                                key={index}
                                className={cn('w-full py-2 px-4 hover:bg-blue-50 hover:text-secondColor', {
                                    "bg-blue-50 text-secondColor" : chosen === data[displayKey]
                                })}
                                onClick={() => handleClick(data)}
                            >
                                <span>{ data[displayKey] }</span>
                            </li>
                        ))
                    }
                </ul>
            </div>
        </div>
    )
})

export default DropdownMenu
