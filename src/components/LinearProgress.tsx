import { useEffect } from 'react'
import { cn } from '../util/utils'

interface LinearProgressProps {
    value?: number,
    label?: boolean,
    id?: string,
}

const LinearProgress = ({ value, label, id }: LinearProgressProps) => {

  useEffect(() => {
    const progressBar = document.getElementById(`${id}`)
    if(progressBar && value !== undefined) {
      progressBar.setAttribute("style", `width:${value}%`)
    }
  }, [value])
    
  return (
    <div className='relative w-full mx-auto h-2 rounded-md shadow-sm shadow-gray-300 bg-white overflow-hidden'>
      {
        value !== undefined ? (<div id={id} className={cn(`absolute inset-0 bg-blue-500 grid`, {
          "rounded-md": value === 100,
          "rounded-tl-md rounded-bl-md": value && value < 100
        })}>
          {
            label && <span className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[0.65rem] text-white font-bold'>
              {value + "%"}
            </span>
          }
        </div>) : (
          <div className='w-full h-full bg-blue-500 animate-linearProgress origin-top-left'>
          </div>
        )
      }
    </div>
  )
}

export default LinearProgress
