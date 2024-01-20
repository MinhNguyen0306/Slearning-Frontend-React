import SearchBox from "../../../components/SearchBox"
import { cn } from "../../../util/utils"
import { tabbar } from "../../../constants/tabbar.constant"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../../redux/store"
import { AlertCircleIcon, LockIcon, UnlockIcon, UsersIcon } from "lucide-react"
import { useState } from 'react';
import useQueryString from "../../../hooks/useQueryString"
import { useQuery } from "react-query"
import userApi from "../../../api/modules/user.api"
import Skeleton from "../../../components/Skeleton"
import { User } from "../../../types/model/User"
import {toast} from 'react-toastify'
import { Tooltip } from "react-tooltip"
import { setUserDetailModalOpen } from "../../../redux/features/appState/appState.slice"
import UserDetailModal from "../../../components/modal/UserDetailModal"
import { Button } from "../../../components/Button"
import { Link, useNavigate } from "react-router-dom"
import { AdminFetchUserState } from "../../../types/payload/enums/AdminFetchUserState"
import { PageRequest } from "../../../types/payload/PageRequest"

const UsersPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
    const sidebarExpand = useSelector((state: RootState) => state.appState.sidebarExpand);
    const [currentState, setCurrentState] = useState<AdminFetchUserState>(AdminFetchUserState.ACTIVE);

    const queryString: { page?: string } = useQueryString();
    const page = Number(queryString.page) || 0;

    const { data, isLoading } = useQuery({
      queryKey: ['users', { page, currentState }],
      queryFn: async () => {
        const pageRequest: PageRequest = { pageNumber: page, pageSize: 5 }
        const { response, error } = await userApi.getUsersByAdminFetchState(pageRequest, currentState)
        if(response) return response.data;
        if(error) {
          toast.error(error.response?.data.errorMessage)
        }
      },
      onError: (error: Error) => {
        toast.error(error.message)
      }
    })

    function handleOpenUserDetail(item: User) {
      dispatch(setUserDetailModalOpen({ open: true, user: item }))
    }

    return (
      <>
        <UserDetailModal />
        <div className="bg-white h-[2000px] p-5 flex flex-col gap-10 mb-32 mt-5">
          <span className="flex gap-5 font-bold text-xl">
            <UsersIcon />
            <span>Quản lý người dùng</span>
          </span>
    
          {/* Tabbar */}
          <div className="block w-full border-[1px] border-gray-300 rounded-md">
            <ul className="flex cursor-pointer">
              {
                tabbar.adminManageUsers.map((tab, index) => (
                  <li 
                    key={index} 
                    className="flex-1"
                    onClick={() => setCurrentState(tab.state)}
                  >
                    <div className={cn("py-4 px-3 text-center transition-all duration-500", {
                      "bg-secondColor text-white font-semibold": tab.state.includes(currentState),
                      "hover:bg-blue-50": currentState !== tab.state,
                      "rounded-tl-md rounded-bl-md": index === 0,
                      "rounded-tr-md rounded-br-md": index === tabbar.adminManageUsers.length - 1
                    })}>
                      <span>{tab.display}</span>
                    </div>
                  </li>
                ))
              }
            </ul>
          </div>
          {/* End tabbar */}
    
          <div className="w-[40%] mx-auto">
            <SearchBox />
          </div>
    
          <div className={cn("max-w-full",{
            "max-w-[calc(100vw-340px)] transition-all duration-1000": sidebarExpand === true,
          })}>
            {
              isLoading 
                ? <Skeleton />
                :  <section className='bg-white border-[1px] border-gray-300 overflow-auto max-h-[500px] rounded-md'>
                    <table className='text-center [&>tbody>*:nth-child(odd)]:bg-gray-100 w-full
                    [&>thead>tr>th:nth-child(1)]:sticky [&>thead>tr>th:nth-child(1)]:left-0 [&>thead>tr>th:nth-child(1)]:z-50 
                    [&>thead>tr>th:nth-child(1)]:px-16 [&>tbody>tr>td:nth-child(1)]:sticky [&>tbody>tr>td:nth-child(1)]:left-0
                    [&>tbody>tr>td:nth-child(1)]:bg-orange-100'>
                      <thead className='[&>tr>*]:sticky [&>tr>*]:top-0 [&>tr>*]:z-10 [&>tr>*]:bg-gray-200 text-black w-full'>
                        <tr>
                            <th className='w-[15%] py-2 px-5 whitespace-nowrap border-r-2'>
                              Mã người dùng
                            </th>
                            <th className='py-2 px-5 whitespace-nowrap border-r-2'>
                              Tên người dùng
                            </th>
                            <th className='py-2 px-5 whitespace-nowrap border-r-2'>
                              Trạng thái
                            </th>
                            <th className='py-2 px-5 whitespace-nowrap border-r-2'>
                              Loại tài khoản
                            </th>
                            <th className='py-2 px-5 whitespace-nowrap border-r-2'>
                              Thao tác
                            </th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          data?.content.map((user, _) => (
                            <tr key={user.id}>
                              <td className='py-3'>
                                <span 
                                  className="w-3/4 overflow-hidden text-ellipsis whitespace-nowrap inline-block"
                                >
                                  { user.id }
                                </span>
                              </td>
                              <td className='py-3'>
                                { user.fullName }
                              </td>
                              <td className='py-3'>
                                <span className="flex items-center justify-center gap-x-2">
                                  <i className={cn("w-2 h-2 rounded-full ", {
                                    "bg-yellow-400": user.userStatus === 'PENDING',
                                    "bg-green-500": user.userStatus === 'ACTIVE',
                                    "bg-red-600": user.userStatus === 'LOCK'
                                  })}></i>
                                  { user.userStatus === 'PENDING' ? "Chờ duyệt" : "Active" }
                                </span>
                              </td>
                              <td className='py-3'>
                                { user.instructor ? <span className="bg-orange-200 rounded-full p-2">Người dạy</span> : <span>Người dùng</span> }
                              </td>
                              <td className='py-3'>
                                <div className="flex justify-evenly items-center">
                                  <div data-tooltip-id="see" data-tooltip-content="Xem chi tiet" className="w-8 h-8 grid place-items-center cursor-pointer rounded-full bg-transparent
                                    hover:bg-gray-300" onClick={() => handleOpenUserDetail(user)}>
                                    <AlertCircleIcon className="text-blue-700"/>
                                    <Tooltip id="see" className="z-50"/>
                                  </div>
                                  <div className="w-8 h-8 grid place-items-center cursor-pointer rounded-full bg-transparent
                                    hover:bg-gray-300">
                                    {
                                      !user.lock 
                                      ? <div data-tooltip-id="lock" data-tooltip-content="Khóa người dùng">
                                          <UnlockIcon />
                                          <Tooltip id="lock" className="z-50"/>
                                        </div> 
                                      : <div data-tooltip-id="unlock" data-tooltip-content="Mở khóa người dùng">
                                          <LockIcon />
                                          <Tooltip id="unlock" className="z-50"/>
                                        </div> 
                                    }
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ))
                        }
                      </tbody>
                    </table>
                  </section>
            }
            {
              !data || data.content.length === 0 &&
              <div className="rounded-md border border-gray-300 flex justify-center items-center gap-y-5 flex-col
              py-14 mt-5">
                <UsersIcon className="w-14 h-14 stroke-[1.25px] stroke-gray-300"/>
                <span className="text-sm text-gray-500">
                  {
                    currentState === AdminFetchUserState.PENDING
                      ? "Không có tài khoản nào đang chờ duyệt"
                      : currentState === AdminFetchUserState.LOCK
                        ? "Không có tài khoản nào bị khóa"
                        : "Không có người dùng nào"
                  }
                </span>
              </div>  
            }

            {/* Navigate Page Action */}
            <div className="flex justify-center mt-5">
              <Button 
                variant='grey' 
                disabled={page === 0}
                onClick={() => navigate(`/admin/users?page=${page - 1}`)}
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
                          to={`/admin/users?page=${pageNumber}`}
                          className={cn("border border-gray-300 hover:border-gray-400 leading-tight hover:text-gray-500 py-2 px-3", {
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
                onClick={() => navigate(`/admin/users?page=${page + 1}`)}
              >
                Next
              </Button>
            </div>
            {/* End navigate Page Action */}
          </div>
        </div>
      </>
    )
}

export default UsersPage
