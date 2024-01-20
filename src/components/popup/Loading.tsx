import { LoaderIcon } from 'lucide-react';

const Loading = () => {
    return (
        <div className='h-screen w-screen fixed z-[99999] top-0 left-0 bg-gray-800 bg-opacity-50
            grid place-items-center overflow-hidden'>
            <div className='w-1/6 h-1/6 m-auto bg-black bg-opacity-80 text-slate-200 rounded-lg border-2 border-slate-200 flex flex-col
            justify-center items-center gap-2'>
                <span className='font-semibold'>Loading</span>
                <LoaderIcon className='animate-spin w-8 h-8' />
            </div>
        </div> 
    )
}

export default Loading
