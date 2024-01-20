import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../redux/store"
import { setWorkExperienceModalOpen } from "../../redux/features/appState/appState.slice";
import { CalendarDaysIcon, XCircleIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from "react-toastify";
import { setLoggedinUser } from "../../redux/features/user/user.slice";
import userApi from "../../api/modules/user.api";
import { SubmitHandler, useForm } from 'react-hook-form';
import { WorkExperienceSchema, workExperienceSchema } from "../../types/zod/WorkExperienceSchema";
import { useMutation } from "react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { WorkExperienceRequest } from "../../types/model/WorkExperience";
import { Button } from "../Button";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import { Tooltip } from "react-tooltip";

const WorkExperienceModal = () => {
    const dispatch = useDispatch();
    const workExperienceModalOpen = useSelector((state: RootState) => state.appState.workExperienceModalOpen);
    const user = useSelector((state: RootState) => state.user.user);
    const [startDate, setStartDate] = useState<Date>(new Date(2020,12));
    const [endDate, setEndDate] = useState<Date>(new Date(2021,12));

    const handleClose = () => dispatch(setWorkExperienceModalOpen(false))
    
    const {register, handleSubmit, formState: { errors }} = useForm<WorkExperienceSchema>({
        resolver: zodResolver(workExperienceSchema)
    })

    const mutation = useMutation({
        mutationFn: (workExperience: WorkExperienceRequest) => userApi.updateWorkExperience(user.id, workExperience),
        onSuccess: (data) => {
            console.log(data)
            if(data.error) {
                toast.error(data.error.message);
            } else {
                dispatch(setLoggedinUser(data.response.data))
                handleClose()
                toast.success("Cập nhật thành công")
            }
        },
        onError: (error: Error) => {
            toast.error(error.message);
        }
    })

    const onSubmit: SubmitHandler<WorkExperienceSchema> = async (values) => {
        const startDateFormatted = format(startDate, 'MM-yyyy')
        const endDateFormatted = format(endDate, 'MM-yyyy')

        const dataSubmit = {...values, startDate: startDateFormatted, endDate: endDateFormatted}
        mutation.mutate(dataSubmit)
    }

    return (
        <>
            {
                workExperienceModalOpen &&
                <div className='h-screen w-screen fixed z-[99999] top-0 left-0 bg-gray-800 bg-opacity-50
                    grid place-items-center overflow-hidden'>
                    <div className='w-1/3 m-auto bg-white rounded-md border-[1px] border-gray-300 flex flex-col
                    justify-center items-center gap-2'>
                        <div className="self-end pt-2 pr-2 cursor-pointer">
                            <XCircleIcon className="hover:stroke-red-600" onClick={handleClose}/>
                        </div>
        
                        <form 
                            onSubmit={handleSubmit(onSubmit)}
                            className='flex flex-col max-h-[500px] overflow-y-scroll gap-y-5 mb-8 w-full px-10 
                            [&>div>label]:font-bold [&>div>label]:mb-2'
                        >
                            <div className="flex flex-col">
                                <label htmlFor="company">Ten cong ty</label>
                                <input 
                                    {...register('company')}
                                    data-tooltip-id="company"
                                    data-tooltip-content={errors.company?.message}
                                    type="text" 
                                    id="company"  
                                    className="border-[1px] outline-none border-gray-800 rounded-md h-[40px] px-3" 
                                />
                                <Tooltip id="company" />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="position">Vi tri</label>
                                <input 
                                    {...register('position')}
                                    data-tooltip-id="position"
                                    data-tooltip-content={errors.position?.message}
                                    type="text" 
                                    id="position" 
                                    className="border-[1px] outline-none border-gray-800 rounded-md h-[40px] px-3" 
                                />
                                <Tooltip id="position" />
                            </div>

                            <div className="flex flex-col ">
                                <span className="font-bold text-xl mb-3">Ngay bat dau</span>
                                <div className="relative w-full border border-gray-600 rounded-md p-2">
                                    <label 
                                        htmlFor="startDate"
                                        className="absolute right-2 top-1/2 -translate-y-1/2 hover:text-blue-600 cursor-pointer"
                                    >
                                        <CalendarDaysIcon />
                                    </label>
                                    <DatePicker 
                                        id="startDate"
                                        selected={startDate}
                                        dateFormat='MM-yyyy'
                                        showMonthYearPicker
                                        minDate={new Date(1980, 12)}
                                        maxDate={new Date()}
                                        onChange={(date: Date) => setStartDate(date)}
                                        className="w-full outline-none cursor-pointer"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col ">
                                <span className="font-bold text-xl mb-3">Ngay roi di</span>
                                <div className="relative w-full border border-gray-600 rounded-md p-2">
                                    <label 
                                        htmlFor="endDate"
                                        className="absolute right-2 top-1/2 -translate-y-1/2 hover:text-blue-600 cursor-pointer"
                                    >
                                        <CalendarDaysIcon />
                                    </label>
                                    <DatePicker 
                                        id="endDate"
                                        selected={endDate} 
                                        dateFormat='MM-yyyy'
                                        showMonthYearPicker
                                        minDate={startDate}
                                        onChange={(date: Date) => setEndDate(date)}
                                        className="w-full outline-none cursor-pointer"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="desc">Mo ta</label>
                                <textarea 
                                    {...register('description')}
                                    data-tooltip-id="description"
                                    data-tooltip-content={errors.description?.message}
                                    id="desc" 
                                    placeholder="Nhap mo ta ve qua trinh, nhung van de gap phai hoac nhung kinh nghiem moi trong qua trinh lam viec..."
                                    className="h-[200px] p-2 border-[1px] outline-none border-gray-800 rounded-md px-3 resize-none" 
                                />
                                <Tooltip id="description" />
                            </div>

                            <Button type="submit" variant='blueContainer' rounded='md'>
                                Them
                            </Button>
                        </form>
                    </div>
                </div> 
            }
        </>
    )
}

export default WorkExperienceModal
