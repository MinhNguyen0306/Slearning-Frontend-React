import { useState } from 'react'
import NewAdvertisementItem from '../NewAdvertisementItem'
import { Layers } from 'lucide-react'

const AdvertisementNew = () => {
    const [data, setData] = useState<string[]>([
        '1', '2', '3', '4'
    ])

    return (
        <>
            {
                !data.length ? (
                <div className='p-5 min-h-[300px] bg-white rounded-md border-[1px] border-gray-300
                flex flex-col justify-center items-center gap-5  font-bold text-lg'>
                    <Layers className="w-16 h-16 text-gray-300"/>
                    <p>Không có gói quảng cáo mới nào</p>
                </div>
                ) : (
                    <div className='py-10 px-20'>
                        <ul className='grid grid-cols-2 gap-10 list-none'>
                            {
                                data.map((item, i) => (
                                    <NewAdvertisementItem id={item}/>
                                ))
                            }
                        </ul>
                    </div>
                )
            }
        </>
        
    )
}

export default AdvertisementNew
