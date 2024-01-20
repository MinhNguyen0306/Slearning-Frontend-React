import { Button } from '../../components/Button'
import { CalendarClockIcon, PlusCircle } from 'lucide-react'
import ReminderModal from '../../components/modal/ReminderModal'
import { useDispatch } from 'react-redux'
import { setReminderModalOpen } from '../../redux/features/appState/appState.slice'

const ReminderPage = () => {
    const dispatch = useDispatch()

    function handleOpenReminderModal() {
        dispatch(setReminderModalOpen({open: true}))
    }

    return (
        <>
            <ReminderModal />
            <div className='w-full bg-white rounded-md p-5'>
                <h1 className='text-xl font-semibold mb-5'>
                    Lịch học của bạn
                </h1>
                {
                    false 
                        ?   <div className='flex flex-col gap-y-3'>
                                <div className='border border-gray-600 p-5 rounded-sm flex justify-between'>
                                    <div className='flex flex-col gap-y-1'>
                                        <h2 className='font-semibold text-lg'>Tieu de su kien</h2>
                                        <p>Mo ta su kien</p>
                                        <p>Khóa học: tên khóa học</p>
                                        <span>Thoi gian su kien</span>
                                        <span>Ngày kết thúc</span>
                                    </div>
                                    <div className='flex flex-col items-end justify-between'>
                                        <CalendarClockIcon />
                                        <Button variant='blueContainer' rounded='md'>
                                            Xem Google Calendar
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        :   <div className='flex flex-col'>
                                <h1 className='mb-3'>Tạo lịch học của bạn</h1>
                                <div>
                                    <Button variant='warning' rounded='md' onClick={handleOpenReminderModal}>
                                        <span className='flex items-center gap-x-2'>
                                            Lên lịch trình học tập <PlusCircle />
                                        </span>
                                    </Button>
                                </div>
                            </div>
                }
            </div>
        </>
    )
}

export default ReminderPage
