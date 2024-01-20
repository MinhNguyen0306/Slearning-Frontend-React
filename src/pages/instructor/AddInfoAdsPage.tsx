import { ChangeEvent, useState } from 'react'
import { Button } from '../../components/Button'
import { ArrowLeftCircleIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import AdvertisementImageForm from '../../components/form/AdvertisementImageForm'
import DropdownMenu from '../../components/DropdownMenu'
import { useDispatch } from 'react-redux'
import { setConfirmModalOpen } from '../../redux/features/appState/appState.slice'

const AddInfoAdsPage = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const [imageBlob, setImageBlob] = useState<string>("")
    const [course, setCourse] = useState<string>("")

    const handleChooseImage = (e: ChangeEvent<HTMLInputElement>) => {
        if(e.target.files) {
            setImageBlob("")
            const newObjectUrl = URL.createObjectURL(e.target.files[0])
            setImageBlob(newObjectUrl)
        }
    }

    function reset() {
        setImageBlob("")
        setCourse("")
        navigate(0)
    }

    return (
        <div className='flex flex-col gap-10 mt-10 mb-40 px-5'>
            <Button
                rounded='lg'
                className='flex gap-2 w-fit'
                onClick={() => navigate(-1)}
            >
                <ArrowLeftCircleIcon />
                Quay lại
            </Button>

            <h1 className='font-bold font-serif text-center text-xl'>Thông tin quảng cáo</h1>

            <div className='flex flex-col text-center bg-white rounded-md border-[1px] border-gray-300'>
                <span className='bg-secondColor text-white leading-10 font-semibold rounded-tl-md rounded-tr-md'>
                    Goi quang cao 14 ngay
                </span>
                <div className='flex flex-col gap-2 px-10 py-5'>
                    <span className='font-bold text-xl text-secondColor'>
                        Gia: 450.000 VND
                    </span>
                    <p>Mô tả</p>
                    <p className='text-red-500 mb-5'> 
                        *Lưu ý: thông tin quảng cáo sau khi được áp dụng sẽ không thể sửa đổi, vì vậy
                        hãy cân nhắc kỹ trước khi Xác Nhận!
                    </p>
                    <div className='w-4/6 mx-auto mb-8'>
                        {/* <DropdownMenu 
                            dataset={categories}
                            label='Chọn khóa học chạy quảng cáo'
                            display='name'
                            value='id'
                            onChange={(v) => setCourse(String(v))}
                        /> */}
                    </div>

                    <AdvertisementImageForm imageBlob={imageBlob} onChange={handleChooseImage}/>

                    <div className='flex justify-center items-center gap-10 mt-5'>
                        <Button 
                            variant='blueContainer' 
                            onClick={() => dispatch(setConfirmModalOpen({open: true, message: 'Bạn có chắc chắc muốn gửi yêu cầu'+
                            'phê duyệt, sau khi được duyệt bạn sẽ không thể chỉnh sửa các thông tin'+
                            'Xin hãy kiểm tra kỹ trước khi gửi yêu cầu'}))}
                        >
                            Xác nhận
                        </Button>
                        <Button variant='blueOutline' onClick={reset}>
                            Làm mới
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddInfoAdsPage
