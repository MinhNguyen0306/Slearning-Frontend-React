import { Layers } from 'lucide-react'
import React from 'react'

const AdvertisementPending = () => {
    return (
        <>
             <div className='p-5 min-h-[300px] bg-white rounded-md border-[1px] border-gray-300
            flex flex-col justify-center items-center gap-5  font-bold text-lg'>
                <Layers className="w-16 h-16 text-gray-300"/>
                <p>Không có quảng cáo nào đã duyệt</p>
            </div>
        </>
    )
}

export default AdvertisementPending
