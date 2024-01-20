import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { CalendarDaysIcon, TimerIcon, XCircleIcon } from 'lucide-react';
import { setReminderModalOpen } from '../../redux/features/appState/appState.slice';
import initialState from '../../redux/features/appState/appState.selector';
import { Button } from '../Button';
import DropdownMenu from '../DropdownMenu';
import { useQuery } from 'react-query';
import progressApi from '../../api/modules/progress.api';
import { cn } from '../../util/utils';
import ReactDatePicker from 'react-datepicker';
import { data } from '../../constants/data';
import { toast } from 'react-toastify';
import { format, setHours, setMinutes } from 'date-fns';
import { CalendarEvent, DateOfWeek } from '../../types/model/CalendarEvent';
import { RecurrenceEvent } from '../../types/payload/enums/RecurrenceEvent';
import calendarApi from '../../api/modules/calendar.api';

const ReminderModal = () => {
    const dispatch = useDispatch();
    const reminderModalstate = useSelector((state: RootState) => state.appState.reminderModalOpen);
    const user = useSelector((state: RootState) => state.user.user)
    const [currentStep, setCurrentStep] = useState<'1' | '2' | '3' | '4'>('1');
    const [summary, setSummary] = useState<string>("");
    const [description, setDescription] = useState<string>("")
    const [chosenCourse, setChosenCourse] = useState<string>("")
    const [recurence, setRecurence] = useState<'once' | 'daily' | 'weekly' | 'monthly'>('once');
    const [duration, setDuration] = useState<'5' | '10' | '20' | '60'>('5');
    const [startDate, setStartDate] = useState<Date>(new Date())
    const [endDate, setEndDate] = useState<Date>(new Date())
    const [startTime, setStartTime] = useState<Date>(setHours(setMinutes(new Date(), 30), new Date().getHours()))
    const [reminderMethod, setReminderMethod] = useState<'email' | 'notification'>('notification');
    const [timeBefore, setTimeBefore] = useState<number>(30);
    const [timeUnitBefore, setTimeUnitBefore] = useState<'minutes' | 'hours' | 'days'>('minutes');
    const [dateOfWeeks, setDateOfWeeks] = useState<DateOfWeek[]>(['MO']);


    const enrollQuery = useQuery({
        queryKey: ['enrollQuery'],
        queryFn: async () => {
        const { response, error } = await progressApi.getMyLearning(user.id)
        if(response) return response.data
        if(error) return Promise.reject()
        }, 
        enabled: user.id !== undefined && user.id !== ""
    })

    function handleClose() {
        dispatch(setReminderModalOpen(initialState.reminderModalOpen))
    }

    function handleNextStep() {
        let check;
        if(currentStep === '1') {
            setCurrentStep('2')
        } else if(currentStep === '2') {
            check = startDate && startTime
            if(check) {
                setCurrentStep('3')
            } else {
                toast.error("Bạn chưa chọn đủ thông tin")
            }
        } else if(currentStep === '3') {
            setCurrentStep('4')
        }
    }

    function handlePrevStep() {
        if(currentStep === '2') {
            setCurrentStep('1')
        } else if(currentStep === '3') {
            setCurrentStep('2')
        } else if(currentStep === '4') {
            setCurrentStep('3')
        }
    }

    function handleChangeStartDate(date: Date) {
        setStartDate(date)
        setEndDate(date)
    }
    
    function handleSetDateOfWeek(date: DateOfWeek) {
        if(dateOfWeeks.includes(date) && dateOfWeeks.length > 1) {
            setDateOfWeeks(prev => [...prev.filter(d => d !== date)])
        } else {
            setDateOfWeeks(prev => [...prev, date])
        }
    }

    const handleCreateCalendar = async () => {
        const recurrenceEventConvert = recurence === 'once' ? RecurrenceEvent.ONCE : recurence === 'daily' 
            ? RecurrenceEvent.DAILY : recurence === 'weekly' ? RecurrenceEvent.WEEKLY : RecurrenceEvent.MONTHLY;

        const calendarEvent: CalendarEvent = {
            title: summary,
            description: description,
            duration: Number(duration.trim()),
            recurrenceEvent: recurrenceEventConvert,
            timeBefore: timeBefore,
            timeUnitBefore: timeUnitBefore,
            reminderMethod: reminderMethod,
            dateOfWeeks: dateOfWeeks,
            startDate: format(startDate, 'dd/MM/yyyy'),
            startTime: format(startTime, 'h:mm a'),
            untilDate: format(new Date(), 'dd/MM/yyyy'),
        }

        console.log(calendarEvent)

        const checkAM = format(startTime, 'h:mm a').includes('AM')

        const {response, error} = await calendarApi.createCalendar(calendarEvent, user.id, checkAM);
        if(response) {
            dispatch(setReminderModalOpen({open: false}))
            toast.success("OK");
        }
        if(error) toast.error("Loi")
    }

    return (
        <>
            {
                reminderModalstate.open &&
                <div className='h-screen w-screen fixed z-[99999] top-0 left-0 bg-gray-800 bg-opacity-50
                grid place-items-center overflow-hidden'>
                <div className='w-[40vw] m-auto bg-white rounded-md border-[1px] border-gray-300 flex flex-col
                justify-center items-center gap-2'>
                    <div className="self-end pt-2 pr-2 cursor-pointer">
                        <XCircleIcon className="hover:stroke-red-600" onClick={handleClose}/>
                    </div>
    
                    <div 
                        className='flex w-[30vw] flex-col overflow-y-scroll scrollbar-hide overflow-x-hidden gap-y-5 mb-8 
                        [&>div>label]:font-bold [&>div>label]:mb-2'
                    >
                        <h2 className='font-bold text-xl'>
                            { currentStep === '1' && "Thông tin sự kiện" }
                            { currentStep === '2' && "Cài đặt sự kiện" }
                            { currentStep === '3' && "Cài đặt nhắc nhở" }
                            { currentStep === '4' && "Tổng kết" }
                        </h2>
                        <span>Bước {currentStep} / 4</span>
                        <div className='min-w-max flex justify-start items-center overflow-x-hidden overflow-y-scroll'>
                            {/* Information event step */}
                            <div className={cn('flex flex-col w-[30vw] gap-y-5 transition-transform duration-300', {
                                'translate-x-0': currentStep === '1',
                                '-translate-x-[30vw]': currentStep === '2',
                                '-translate-x-[60vw]': currentStep === '3',
                                '-translate-x-[90vw]': currentStep === '4',
                            })}>
                                <div className="flex flex-col">
                                    <label htmlFor="summary">Tiêu đề</label>
                                    <input 
                                        type="text" 
                                        id="summary"  
                                        autoComplete='off'
                                        onChange={(e) => setSummary(e.target.value)}
                                        className="border-[1px] outline-none border-gray-800 rounded-md h-[40px] px-3" 
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label htmlFor="description">Mô tả (không bắt buộc)</label>
                                    <input 
                                        type="text" 
                                        id="description"  
                                        autoComplete='off'
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="border-[1px] outline-none border-gray-800 rounded-md h-[40px] px-3" 
                                    />
                                </div>

                                <div className='flex flex-col'>
                                    <label htmlFor="course">Chọn khóa học</label>
                                    <DropdownMenu
                                        name='course'
                                        label='Chọn khóa học'
                                        valueKey='id'
                                        displayKey='title'
                                        dataset={enrollQuery.data?.content ?? []}
                                        onChange={(v) => setChosenCourse(v)}
                                    />
                                </div>
                            </div>
                            {/* End infomation event step */}

                            {/* Setting event step */}
                            <div className={cn('flex flex-col w-[30vw] gap-y-7 transition-transform duration-300', {
                                'translate-x-[30vw]': currentStep === '1',
                                '-translate-x-[30vw]': currentStep === '2',
                                '-translate-x-[60vw]': currentStep === '3',
                                '-translate-x-[90vw]': currentStep === '4'
                            })}>
                                {/* Recurence group */}
                                <div className='flex flex-col gap-y-2'>
                                    <span className='font-semibold'>Tần suất lặp lại</span>
                                    <div className='flex justify-start items-center gap-x-3'>
                                        <div className={cn('rounded-full py-2 px-3 border border-slate-300 cursor-pointer hover:bg-gray-200', {
                                            'text-white bg-black hover:bg-gray-800': recurence === 'once'
                                        })} onClick={() => setRecurence('once')}>
                                            Không lặp
                                        </div>
                                        <div className={cn('rounded-full py-2 px-3 border border-slate-300 cursor-pointer hover:bg-gray-200', {
                                            'text-white bg-black hover:bg-gray-800': recurence === 'daily'
                                        })} onClick={() => setRecurence('daily')}>
                                            Hàng ngày
                                        </div>
                                        <div className={cn('rounded-full py-2 px-3 border border-slate-300 cursor-pointer hover:bg-gray-200', {
                                            'text-white bg-black hover:bg-gray-800': recurence === 'weekly'
                                        })} onClick={() => setRecurence('weekly')}>
                                            Hàng tuần
                                        </div>
                                        <div className={cn('rounded-full py-2 px-3 border border-slate-300 cursor-pointer hover:bg-gray-200', {
                                            'text-white bg-black hover:bg-gray-800': recurence === 'monthly'
                                        })} onClick={() => setRecurence('monthly')}>
                                            Hàng tháng
                                        </div>
                                    </div>
                                </div>
                                {/* End recurence group */}

                                {/* Date in week box */}
                                { recurence === 'weekly' &&
                                    <div className='flex justify-start items-center gap-x-2'>
                                        <span className='font-bold'>Thứ</span>
                                        <div className={cn('w-8 h-8 flex items-center justify-center rounded-full p-2 border border-gray-300 cursor-pointer', 
                                            'hover:bg-gray-200', {
                                            'bg-black text-white hover:bg-gray-800': dateOfWeeks.includes('MO')
                                        })} onClick={() => handleSetDateOfWeek('MO')}>
                                            <span>2</span>
                                        </div>
                                        <div className={cn('w-8 h-8 flex items-center justify-center rounded-full p-2 border border-gray-300 cursor-pointer', 
                                            'hover:bg-gray-200', {
                                            'bg-black text-white hover:bg-gray-800': dateOfWeeks.includes('TU')
                                        })} onClick={() => handleSetDateOfWeek('TU')}>
                                            <span>3</span>
                                        </div>
                                        <div className={cn('w-8 h-8 flex items-center justify-center rounded-full p-2 border border-gray-300 cursor-pointer', 
                                            'hover:bg-gray-200', {
                                            'bg-black text-white hover:bg-gray-800': dateOfWeeks.includes('WE')
                                        })} onClick={() => handleSetDateOfWeek('WE')}>
                                            <span>4</span>
                                        </div>
                                        <div className={cn('w-8 h-8 flex items-center justify-center rounded-full p-2 border border-gray-300 cursor-pointer', 
                                            'hover:bg-gray-200', {
                                            'bg-black text-white hover:bg-gray-800': dateOfWeeks.includes('TH')
                                        })} onClick={() => handleSetDateOfWeek('TH')}>
                                            <span>5</span>
                                        </div>
                                        <div className={cn('w-8 h-8 flex items-center justify-center rounded-full p-2 border border-gray-300 cursor-pointer', 
                                            'hover:bg-gray-200', {
                                            'bg-black text-white hover:bg-gray-800': dateOfWeeks.includes('FI')
                                        })} onClick={() => handleSetDateOfWeek('FI')}>
                                            <span>6</span>
                                        </div>
                                        <div className={cn('w-8 h-8 flex items-center justify-center rounded-full p-2 border border-gray-300 cursor-pointer', 
                                            'hover:bg-gray-200', {
                                            'bg-black text-white hover:bg-gray-800': dateOfWeeks.includes('SA')
                                        })} onClick={() => handleSetDateOfWeek('SA')}>
                                            <span>7</span>
                                        </div>
                                        <div className={cn('w-8 h-8 flex items-center justify-center rounded-full p-2 border border-gray-300 cursor-pointer', 
                                            'hover:bg-gray-200', {
                                            'bg-black text-white hover:bg-gray-800': dateOfWeeks.includes('SU')
                                        })} onClick={() => handleSetDateOfWeek('SU')}>
                                            <span>CN</span>
                                        </div>
                                    </div>
                                }
                                {/* End date in week box */}

                                {/* Date box */}
                                {
                                    (recurence === 'once' || recurence === 'monthly') &&
                                    <div className="relative w-full border border-gray-600 rounded-md p-2">
                                        <label 
                                            htmlFor="startDate"
                                            className="absolute right-2 top-1/2 -translate-y-1/2 hover:text-blue-600 cursor-pointer"
                                        >
                                            <CalendarDaysIcon />
                                        </label>
                                        <ReactDatePicker 
                                            id="startDate"
                                            selected={startDate}
                                            dateFormat='dd-MM-yyyy'
                                            minDate={new Date()}
                                            onChange={(date: Date) => handleChangeStartDate(date)}
                                            className="w-full outline-none cursor-pointer"
                                        />
                                    </div>
                                }
                                {/* End date box */}

                                {/* Duration box */}
                                <div className='flex flex-col gap-y-2'>
                                    <span className='font-semibold'>Khoảng thời gian</span>
                                    <div className='flex justify-start items-center gap-x-3'>
                                        <div className={cn('rounded-full py-2 px-3 border border-slate-300 cursor-pointer hover:bg-gray-200', {
                                            'text-white bg-black hover:bg-gray-800': duration === '5'
                                        })} onClick={() => setDuration('5')}>
                                            5 phút
                                        </div>
                                        <div className={cn('rounded-full py-2 px-3 border border-slate-300 cursor-pointer hover:bg-gray-200', {
                                            'text-white bg-black hover:bg-gray-800': duration === '10'
                                        })} onClick={() => setDuration('10')}>
                                            10 phút
                                        </div>
                                        <div className={cn('rounded-full py-2 px-3 border border-slate-300 cursor-pointer hover:bg-gray-200', {
                                            'text-white bg-black hover:bg-gray-800': duration === '20'
                                        })} onClick={() => setDuration('20')}>
                                            20 phút
                                        </div>
                                        <div className={cn('rounded-full py-2 px-3 border border-slate-300 cursor-pointer hover:bg-gray-200', {
                                            'text-white bg-black hover:bg-gray-800': duration === '60'
                                        })} onClick={() => setDuration('60')}>
                                            1 giờ
                                        </div>
                                    </div>
                                </div>
                                {/* End duration box */}

                                {/* Time box */}
                                <div className='flex flex-col gap-y-3'>
                                    <h2 className='font-semibold'>Vào lúc</h2>
                                    <div className="relative w-full border border-gray-600 rounded-md p-2">
                                        <label 
                                            htmlFor="startTime"
                                            className="absolute right-2 top-1/2 -translate-y-1/2 hover:text-blue-600 cursor-pointer"
                                        >
                                            <TimerIcon />
                                        </label>
                                        <ReactDatePicker 
                                            id="startTime"
                                            selected={startTime}
                                            dateFormat='h:mm aa'
                                            timeCaption='Time'
                                            showTimeSelect
                                            showTimeSelectOnly
                                            minTime={setHours(setMinutes(new Date(), 30), new Date().getHours())}
                                            maxTime={setHours(setMinutes(new Date(), 30), 23)}
                                            onChange={(date: Date) => setStartTime(date)}
                                            className="w-full outline-none cursor-pointer"
                                        />
                                    </div>
                                </div>
                                {/* End time box */}

                                {/* End date group */}
                                {
                                    recurence !== 'once' &&
                                    <div className='flex flex-col gap-y-3'>
                                        <h2 className='font-semibold'>
                                            Ngày kết thúc
                                        </h2>
                                        <div className="relative w-full border border-gray-600 rounded-md p-2">
                                            <label 
                                                htmlFor="startDate"
                                                className="absolute right-2 top-1/2 -translate-y-1/2 hover:text-blue-600 cursor-pointer"
                                            >
                                                <CalendarDaysIcon />
                                            </label>
                                            <ReactDatePicker 
                                                id="endDate"
                                                selected={endDate}
                                                dateFormat='dd-MM-yyyy'
                                                minDate={startDate ? startDate : new Date()}
                                                onChange={(date: Date) => setEndDate(date)}
                                                className="w-full outline-none cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                }
                                {/* End end date group */}
                            </div>
                            {/* End setting event step */}

                            {/* Setting reminder step */}
                            <div className={cn('flex flex-col w-[30vw] gap-y-5 transition-transform duration-300', {
                                'translate-x-[60vw]': currentStep === '1',
                                '-translate-x-[30vw]': currentStep === '2',
                                '-translate-x-[60vw]': currentStep === '3',
                                '-translate-x-[90vw]': currentStep === '4'
                            })}>
                                {/* Reminder box */}
                                <div className='flex flex-col gap-y-3'>
                                    <h2 className='font-semibold text-lg'>Nhắc nhở qua - Trước khoảng - Đơn vị thời gian</h2>
                                    <div className='flex items-center justify-start h-[40px]'>
                                        <DropdownMenu 
                                            variant='noneRounded'
                                            height='full'
                                            name='reminderMethod'
                                            dataset={data.reminderMethods}
                                            valueKey='id'
                                            displayKey='method'
                                            onChange={(v) => setReminderMethod(v)}
                                        />

                                        <input 
                                            type="number" 
                                            min={0}
                                            defaultValue={timeBefore}
                                            onChange={(e) => setTimeBefore(Number(e.target.value))}
                                            className='w-1/2 h-full outline-none border-y border-gray-800 text-center'
                                        />

                                        <DropdownMenu 
                                            variant='noneRounded'
                                            height='full'
                                            name='reminderTimeUnitBefore'
                                            dataset={data.reminderTimeUnitBefores}
                                            valueKey='id'
                                            displayKey='unit'
                                            onChange={(v) => setTimeUnitBefore(v)}
                                        />
                                    </div>
                                </div>
                                {/* End reminder box */}
                            </div>
                            {/* End setting reminder step */}

                            {/* Summary step */}
                            <div className={cn('flex flex-col w-[30vw] gap-y-5 transition-transform duration-300', {
                                'translate-x-[90vw]': currentStep === '1',
                                '-translate-x-[30vw]': currentStep === '2',
                                '-translate-x-[60vw]': currentStep === '3',
                                '-translate-x-[90vw]': currentStep === '4'
                            })}>
                                <div className='flex flex-col rounded-md p-5 bg-slate-100 border border-slate-300'>
                                    <span>Tiêu đề: { summary }</span>
                                    {
                                        description !== "" &&
                                        <span>Mô tả: { description  }</span>
                                    }
                                    <span>{ chosenCourse }</span>
                                    <span>
                                        { recurence === 'daily' && "Lặp lại hàng ngày" }
                                        { recurence === 'weekly' && 
                                            `Lặp lại hàng tuần vào thứ ${ dateOfWeeks.join(', ') }` 
                                        }
                                        { recurence === 'monthly' && "Lặp lại hàng tháng" }
                                    </span>
                                    {
                                        (recurence === 'once' || recurence === 'monthly') &&
                                        <span>
                                            Vào ngày { startDate.toLocaleDateString()}
                                        </span>
                                    }
                                    <span>
                                        Diễn ra { duration } phút lúc { format(startTime, 'hh:mm a') }
                                    </span>
                                    {
                                        recurence !== 'once' &&
                                        <span>Cho đến { endDate?.toLocaleDateString() }</span>
                                    }
                                    <span>
                                        Gửi { reminderMethod } { timeBefore } { timeUnitBefore === 'minutes' ? 'phút' : timeUnitBefore === 'hours' ? 'giờ' : 'ngày' } trước khi diễn ra
                                    </span>
                                </div>
                            </div>
                            {/* End summary step */}
                        </div>

                        <div className='flex justify-end gap-x-2'>
                            {
                                (currentStep === '2' || currentStep === '3' || currentStep === '4') &&
                                <Button type="submit" rounded='md' onClick={handlePrevStep}>
                                    Quay lại
                                </Button>
                            }
                            <div>
                                {
                                    (currentStep === '1' || currentStep === '2' || currentStep === '3') && 
                                    <Button type="submit" rounded='md' onClick={handleNextStep}>
                                        Tiếp theo
                                    </Button>
                                }
                                {
                                    currentStep === '4' && 
                                    <Button type="submit" rounded='md' onClick={handleCreateCalendar}>
                                        Hoàn tất
                                    </Button>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                </div> 
            }
        </>
    )
}

export default ReminderModal
