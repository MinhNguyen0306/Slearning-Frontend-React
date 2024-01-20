import { useRef, useEffect, useState } from 'react'
import { cn } from '../util/utils';
import { CheckIcon } from 'lucide-react';

type StepperProps = {
    maxStep?: number
    step: number,
    labels?: string[]
}

const Stepper = ({step, maxStep, labels}: StepperProps) => {
    const [percentLoading, setPercentLoading] = useState<number>(0)
    const barRef = useRef<HTMLDivElement>(null);
    const stepRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(maxStep && step < maxStep) {
            if(barRef.current && stepRef.current) {
                const segmentLoading = ((barRef.current?.offsetWidth - (stepRef.current?.offsetWidth * 4)) / 3) + stepRef.current.offsetWidth
                const rate = (segmentLoading / barRef.current.offsetWidth) * 100
                setPercentLoading(rate * step)
            }
        }
    }, [step])

    useEffect(() => {
        window.scrollTo({
            behavior: 'smooth',
            top: 0,
        })
    }, [step])

    return (
        <div ref={barRef} className='relative w-full h-4 border-[1px] bg-gray-300 rounded-md flex flex-col gap-10'>
            <div className='absolute inset-0 w-full h-full flex justify-between items-center'>
                {
                Array(4).fill(0).map((_, index) => index + 1).map((_, i) => (
                    <div key={i} className='relative grid place-items-center border-4 border-gray-300 bg-white w-10 h-10 rounded-full'>
                        <span>{i + 1}</span>
                        <span className={cn('absolute text-center whitespace-nowrap font-semibold top-full mt-2', {
                            "text-mainColorBold": i <= step
                        })}>
                            {labels ? labels[i] : null}
                        </span>
                    </div>
                ))
                }
            </div>
            <div className={cn(`absolute left-0 top-0 h-full overflow-hidden bg-gradient-to-r from-mainColorHover to-mainColorBold rounded-md transition-all duration-500`, {
                "w-0": percentLoading < 10 ,
                "w-[34%]": percentLoading < 35 && percentLoading > 0,
                "w-[66%]": percentLoading > 35 && percentLoading < 65,
                "w-full": percentLoading > 65 && percentLoading < 100,
            })}>
            </div>
            <div className='absolute inset-0 flex items-center justify-between'>
                {
                Array(maxStep).fill(0).map((_, index) => index).map((_, i) => (
                    <div ref={stepRef} key={i} className={cn('grid place-items-center bg-mainColorBold w-10 h-10 rounded-full', 
                    "invisible opacity-0", {
                    "visible opacity-100": i <= step
                    })}>
                        {
                            i !== step ? (
                                <CheckIcon className={cn('w-5 h-5 stroke-[0.4rem] stroke-white text-white', {
                                })}/>
                            ) : (
                                <div className='grid place-items-center bg-white w-6 h-6 text-mainColorBold font-extrabold rounded-full'>
                                    {i + 1}
                                </div>
                            )
                        }
                    </div>
                ))
                }
            </div>
        </div>
    )
}

export default Stepper
