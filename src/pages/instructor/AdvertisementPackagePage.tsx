import React from 'react'
import PackageItem from '../../components/PackageItem'
import { useNavigate } from 'react-router-dom'
import { ArrowLeftCircleIcon } from 'lucide-react';
import { Button } from '../../components/Button';

const AdvertisementPackagePage = () => {
    const navigate = useNavigate();

    return (
        <div className='mb-40 px-10 flex flex-col gap-12'>
            <Button 
                rounded='md'
                className='mt-10 font-bold text-xl flex items-center gap-3 cursor-pointer w-fit' 
                onClick={() => navigate(-1)}
            >
                <ArrowLeftCircleIcon />
                <span>Quay lại</span>
            </Button>
            <div className='flex flex-col items-center justify-start mt-16'>
                <h3 className='text-2xl font-bold font-serif mb-2'>Bảng Giá</h3>
                <h1 className='font-bold text-4xl bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500'>
                    Các Gói Quảng Cáo Trên Slearning
                </h1>
            </div>
            <div className='grid grid-cols-3 gap-5'>
                <PackageItem />
                <PackageItem />
                <PackageItem />
                <PackageItem />
            </div>
        </div>
    )
}

export default AdvertisementPackagePage
