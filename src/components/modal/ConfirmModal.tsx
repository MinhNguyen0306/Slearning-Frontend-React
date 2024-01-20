import { AlertCircle } from 'lucide-react'
import { Button } from '../Button'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store'

const ConfirmModal = () => {
    const ditpatch = useDispatch()
    const confirmModal = useSelector((state: RootState) => state.appState.confirmModalOpen)

    return (
        <>
            {
                confirmModal.open &&
                <div className='h-screen w-screen fixed z-[99999] top-0 left-0 bg-gray-800 bg-opacity-50
                grid place-items-center overflow-hidden'>
                    <div className='max-w-[500px] max-h-[500px] break-words p-5 rounded-md shadow-md shadow-gray-300 bg-white 
                    flex flex-col gap-3 items-center justify-center text-center'>
                        <AlertCircle className='w-16 h-16 stroke-red-500 stroke-[1px]' />
                        <h1 className='font-bold text-lg'>Lưu ý</h1>
                        <p>
                            { confirmModal.message }
                        </p>
                        <div className='flex justify-end gap-5 mt-5'>
                            <Button variant='danger' rounded='md'>
                                Đồng ý
                            </Button>
                            <Button variant='light' rounded='md'>
                                Hủy
                            </Button>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default ConfirmModal
