import Skeleton from '../Skeleton';
import { cn } from '../../util/utils';
import { RootState } from '../../redux/store';
import { useSelector } from 'react-redux';
import useQueryString from '../../hooks/useQueryString';
import { useQuery } from 'react-query';
import courseApi from '../../api/modules/course.api';
import {toast} from 'react-toastify'
import { Tooltip } from 'react-tooltip';
import { ArrowRightIcon, Boxes, Edit3Icon } from 'lucide-react';
import { Button } from '../Button';
import { Link, useNavigate } from 'react-router-dom';
import { CourseStatus } from '../../types/payload/enums/CourseStatus';

const CoursesPublishing = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.user)
  const sidebarExpand = useSelector((state: RootState) => state.appState.sidebarExpand);

  const queryString: { page?: string } = useQueryString();
  const page = Number(queryString.page) || 0;

  const { data, isLoading } = useQuery({
    queryKey: ['coursesDraft', { page }],
    queryFn: async () => {
      const { response, error } = await courseApi.getByStatus(CourseStatus.PUBLISHING, { pageNumber: page, pageSize: 5 }, user.id)
      if(response) return response.data;
      if(error) {
        toast.error(error.message)
      }
    },
    onError: (error: Error) => {
      toast.error(error.message)
    }
  })

  return (
    <div className={cn("max-w-full",{
        "max-w-[calc(100vw-340px)] transition-all duration-1000": sidebarExpand === true,
      })}>
        {
          data && data.content.length < 1
            ? (
              <div className='w-full h-80 rounded-xl p-10 flex flex-col items-center justify-center
                gap-y-7'>
                <Boxes className='w-14 h-14 stroke-gray-600'/>
                <div className='flex flex-col text-gray-500 text-xl'>
                  <span>Rất tiếc. Bạn chưa có khóa học nào đang được xuất bản!</span>
                  <span>Tạo khóa học mới hoặc hoàn thành bản nháp và xuất bản</span>
                </div>
                <Button rounded='md' onClick={() => navigate("/instructor/courses/uncompleted")}>
                  <span className='flex gap-x-2'>Tiếp tục <ArrowRightIcon /></span>
                </Button>
              </div>
            )  
            : (
                <div>
                  <section className='w-full bg-white overflow-auto max-h-[500px] rounded-md'>
                      {
                          isLoading 
                          ?   <Skeleton />
                          :   <table className='border border-gray-300 text-center [&>tbody>*:nth-child(odd)]:bg-gray-100 w-full
                              [&>thead>tr>th:nth-child(1)]:sticky [&>thead>tr>th:nth-child(1)]:left-0 [&>thead>tr>th:nth-child(1)]:z-50 
                              [&>thead>tr>th:nth-child(1)]:px-16 [&>tbody>tr>td:nth-child(1)]:sticky [&>tbody>tr>td:nth-child(1)]:left-0
                              [&>tbody>tr>td:nth-child(1)]:bg-orange-100'>
                                  <thead className='[&>tr>*]:sticky [&>tr>*]:top-0 [&>tr>*]:z-10 [&>tr>*]:bg-gray-200 text-black w-full'>
                                      <tr>
                                          <th className='w-[15%] py-2 px-5 whitespace-nowrap border-r-2'>
                                              Mã khóa học
                                          </th>
                                          <th className='py-2 px-5 whitespace-nowrap border-r-2'>
                                              Tiêu đề
                                          </th>
                                          <th className='py-2 px-5 whitespace-nowrap border-r-2'>
                                              Trạng thái
                                          </th>
                                          {/* <th className='py-2 px-5 whitespace-nowrap border-r-2'>
                                              Tien do
                                          </th> */}
                                          <th className='py-2 px-5 whitespace-nowrap border-r-2'>
                                              Thao tác
                                          </th>
                                      </tr>
                                  </thead>
                                  <tbody>
                                      {
                                          data?.content.map((course, _) => (
                                              <tr key={course.id}>
                                                  <td className='py-3'>
                                                      <span 
                                                          className="max-w-[75%] overflow-hidden text-ellipsis whitespace-nowrap inline-block"
                                                      >
                                                      { course.id }
                                                      </span>
                                                  </td>
                                                  <td className='py-3 grid place-items-center'>
                                                      <div className="w-[400px] px-3">
                                                          <span className='break-all'>
                                                              { course.title }
                                                          </span>
                                                      </div>
                                                  </td>
                                                  <td className='py-3'>
                                                      <span className="flex items-center justify-center gap-x-2">
                                                      <i className="w-2 h-2 rounded-full bg-active"></i>
                                                          Đang xuất bản
                                                      </span>
                                                  </td>
                                                  {/* <td className='py-3'>
                                                      <span>
                                                          {
                                                              Object.entries(course).reduce((prev: any, key: any) => {
                                                                  return (course[key] === null ) ? prev + 1 : 5;
                                                              }, 0)
                                                          }
                                                      </span>
                                                  </td> */}
                                                  <td className='py-3'>
                                                      <div className="flex justify-evenly items-center">
                                                          <div 
                                                              data-tooltip-id="see" 
                                                              data-tooltip-content="Tiếp tục hoàn thiện" 
                                                              className="w-8 h-8 grid place-items-center cursor-pointer rounded-full bg-transparent
                                                              hover:bg-gray-300"
                                                              onClick={() => navigate(`/instructor/courses/${course.id}/create/step/1`)}
                                                          >
                                                              <Edit3Icon className="text-blue-700 w-5 h-5"/>
                                                              <Tooltip id="see" className="z-50"/>
                                                          </div>
                                                          {/* <div className="w-8 h-8 grid place-items-center cursor-pointer rounded-full bg-transparent
                                                              hover:bg-gray-300">
                                                              {
                                                              course.status === 'UN_PUBLISHING' 
                                                              ? <div data-tooltip-id="lock" data-tooltip-content="Khoa nguoi dung">
                                                                  <LockIcon />
                                                                  <Tooltip id="lock" className="z-50"/>
                                                                  </div> 
                                                              : <div data-tooltip-id="unlock" data-tooltip-content="Mo khoa nguoi dung">
                                                                  <UnlockIcon />
                                                                  <Tooltip id="unlock" className="z-50"/>
                                                                  </div> 
                                                              }
                                                          </div> */}
                                                      </div>
                                                  </td>
                                              </tr>
                                          ))
                                      }
                                  </tbody>
                              </table>
                      }
                  </section>
          
                  {/* Navigate Page Action */}
                  <div className="flex justify-center mt-5">
                    <Button 
                      variant='grey' 
                      className={cn({
                        "cursor-not-allowed": page === 0
                      })}
                      disabled={page === 0}
                      onClick={() => navigate(`/instructor/courses/uncompleted?page=${page - 1}`)}
                    >
                      Prev
                    </Button>
                    <ul className="flex items-center">
                      {
                          data && Array(data.totalPages).fill(0).map((_, index) => {
                              const pageNumber = index;
                              const isActive = page === pageNumber;
                              return (
                                  <li key={pageNumber}>
                                      <Link 
                                          to={`/instructor/courses/uncompleted?page=${pageNumber}`}
                                          className={cn("border border-gray-300 hover:border-gray-400 leading-tight hover:text-gray-500 py-2 px-3 cursor-pointer", {
                                              "bg-gray-200 text-gray-700": isActive
                                          })}
                                      >
                                          { pageNumber }
                                      </Link>
                                  </li>
                              )
                          })
                      }
                    </ul>
                    <Button 
                      variant='grey' 
                      disabled={data?.last}
                      onClick={() => navigate(`/instructor/courses/uncompleted?page=${page + 1}`)}
                    >
                      Next
                    </Button>
                  </div>
                  {/* End navigate Page Action */}
                </div>
              )
            }
    </div>
)
}

export default CoursesPublishing

