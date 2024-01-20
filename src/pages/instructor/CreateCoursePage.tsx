import { VideoIcon} from 'lucide-react';
import React, { useState, useRef, useEffect } from "react";
import Stepper from '../../components/Stepper';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../components/Button';
import { useQuery } from 'react-query';
import courseApi from '../../api/modules/course.api';
import { toast } from "react-toastify";

const CreateCoursePage = () => {
    const navigate = useNavigate();
    const params = useParams();
    const { pathname } = useLocation();
    let currentPage = Number(pathname.split("/")[pathname.split("/").length - 1])
    const nextStepBarRef = useRef<HTMLDivElement>(null);

    const { data } = useQuery({
        queryKey: ['courseCreating', params.id],
        queryFn: async () => {
          if(params.id) {
            const {response, error} = await courseApi.getById(params.id)
            if(error) {
                toast.error(error.message)
                navigate("/")
                return Promise.reject(error)
            }
            if(response) return response
          } else {
            navigate("/")
          }
        },
        onError: (error: Error) => {
          toast.error(error.message)
        }
    })


    function checkCourseToNext() {
        if(data) {
            const course = data.data
            if(course.description && course.requirement && course.introduce && course.price
                && course.achievement && course.topic && course.image && course.level && currentPage === 1
            ) {
                return true
            } else if(course.chapters.length > 0 && course.chapters.every(c => c.lectures.length > 0 && c.lectures.every(l => l.videoStorage)) && currentPage === 2
            || currentPage === 3) {
                return true;
            } else {
                return false
            }
        } else {
            return false;
        }
    }

    
    function nextStep() {
        navigate(pathname.slice(0, -1) + String(currentPage + 1))
        // setStep(prev => prev + 1)
    }

    function prevStep() {
        navigate(pathname.slice(0, -1) + String(currentPage - 1))
        // setStep(prev => prev - 1)
    }

    return (
        <div className='flex flex-col p-10 mb-28'>
            <div className='p-7 shadow-md shadow-gray-300 rounded-e-md bg-white'>
                <span className='font-bold text-2xl'>
                    <VideoIcon className='inline-block mr-5'/>
                    Tạo khóa học mới
                </span>

                {/* Stepper */}
                <div className='w-[70%] mx-auto my-10'>
                    <Stepper step={currentPage - 1} maxStep={4} labels={['Thông tin khóa học', 'Chương trình giảng dạy', 'Câu hỏi ôn tập', 'Xuất bản']}/>
                </div>
                {/* End Stepper */}
            </div>

            <Outlet />

            {/* Next Step Bar */}
            <div ref={nextStepBarRef} className='w-full mt-10 rounded-md shadow-md shadow-gray-300 bg-white'>
                <div className='px-5 py-3 w-full flex items-center justify-between'>
                    <Button disabled={currentPage === 1} size='lengthen' rounded='md' onClick={prevStep}>
                        Quay lại
                    </Button>
                    <Button size='lengthen' rounded='md' disabled={!checkCourseToNext()} onClick={nextStep}>
                        Tiếp theo
                    </Button>
                </div>
            </div>
            {/* End Next Step Bar */}
        </div>
    )
}

export default CreateCoursePage
