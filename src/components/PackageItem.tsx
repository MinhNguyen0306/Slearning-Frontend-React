import { MoveRightIcon } from 'lucide-react'
import React from 'react'

const PackageItem = () => {
    return (
        <div className='relative px-8 py-10 bg-white shadow-2xl shadow-gray-300 rounded-md flex flex-col items-center justify-center
        gap-14 cursor-pointer group'>
            <div className='flex flex-col gap-1 justify-center items-center'>
                <span className='font-bold text-secondColor text-lg'>Gói 14 ngày</span>
                <span className='font-bold text-2xl text-cyan-900'>450.000 VND</span>
                <span className='text-center'>
                    Quảng cáo khóa học của bạn trên trang chủ trong vòng 14 ngày kể 
                    từ ngày bắt đầu áp dụng gói này
                </span>
            </div>
            <span className='font-bold bg-transparent rounded-md p-2 hover:ring-1 hover:ring-gray-500
            hover:ring-offset-1 hover:bg-black hover:bg-opacity-80 hover:text-white transition-all duration-500'>
                Chọn gói này
                <MoveRightIcon className='inline-block ml-3 w-4 h-4 stroke-[0.20rem]'/>
            </span>
            <div className='absolute w-20 h-20 -right-1 -top-1 overflow-hidden 
            after:absolute after:w-1 after:top-0 after:left-[0.107rem] after:h-1 after:bg-yellow-500
            before:absolute before:w-1 before:bottom-0.5 before:right-0 before:h-1 before:bg-yellow-500'>
                <div className='absolute bg-yellow-500 w-[150%] h-[40%] top-3 -left-2 rotate-45 text-center
                font-bold text-white text-xs leading-[30px]'>
                    1 Day
                </div>
            </div>
        </div>
    )
}

export default PackageItem
