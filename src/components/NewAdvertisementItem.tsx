import React from 'react'
import { Button } from './Button'
import { useNavigate } from 'react-router-dom'

interface Props {
    id: string | number
}

const NewAdvertisementItem = ({ id } : Props) => {
    const navigate = useNavigate();

    return (
        <div className='w-full border-2 border-secondColor rounded-md flex flex-col'>
            <h2 className='font-bold w-full py-2 bg-secondColor text-center text-white'>
                Gói quảng cáo Copper
            </h2>
            <div className='flex flex-col gap-3 items-center justify-center p-5'>
                <span className='font-semibold text-xl text-secondColor'>
                    Giá gói: 500.000 VNĐ
                </span>
                <span>Áp dụng trong: 15 ngày kể từ ngày bắt đầu</span>
                <span>Áp dụng cho: 1 khóa học</span>
                <Button 
                    variant='blueContainer' 
                    rounded='sm' 
                    size='lengthen'
                    onClick={() => navigate(`/instructor/advertisements/${id}/apply`)}
                >
                    Tạo thông tin
                </Button>
            </div>
        </div>
    )
}

export default NewAdvertisementItem
