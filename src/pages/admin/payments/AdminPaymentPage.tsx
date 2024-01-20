import { Boxes, CreditCardIcon } from "lucide-react"
import { tabbar } from "../../../constants/tabbar.constant"
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { cn } from "../../../util/utils";
import Skeleton from "../../../components/Skeleton";
import { useQuery } from "react-query";
import userApi from "../../../api/modules/user.api";
import useQueryString from "../../../hooks/useQueryString";
import { PageRequest } from "../../../types/payload/PageRequest";
import { toast } from "react-toastify";
import { Button } from "../../../components/Button";
import { useNavigate } from "react-router-dom";
import MentorPaymentData from "./AdminPaymentData";
import paymentApi from "../../../api/modules/payment.api";
import AdminPaymentData from "./AdminPaymentData";

const AdminPaymentPage = () => {
  const navigate = useNavigate();
  const { sidebarExpand } = useSelector((state: RootState) => state.appState);
  const [currentState, setCurrentState] = useState<'pending' | 'success' | 'waiting'>('pending');

  const queryString: { page?: string } = useQueryString();
  const page = Number(queryString.page) || 0;
  
  const adminPaymentPending = useQuery({
    queryKey: ['adminPaymentPending', currentState],
    queryFn: async () => {
      const pageRequest: PageRequest = { pageNumber: page, pageSize: 5 }
      const { response, error } = await paymentApi.getPendingAdminPayment(pageRequest)
      if(response) {
        return response.data
      }
      if(error) {
        toast.error(error.response?.data.errorMessage)
        return Promise.reject()
      }
    },
    enabled: currentState === 'pending',
    onError(error: Error) {
      toast.error(error.message)
    }
  })

  const adminPaymentSuccess = useQuery({
    queryKey: ['adminPaymentSuccess', currentState],
    queryFn: async () => {
      const pageRequest: PageRequest = { pageNumber: page, pageSize: 5 }
      const { response, error } = await paymentApi.getSuccessAdminPayment(pageRequest)
      if(response) {
        return response.data
      }
      if(error) {
        toast.error(error.response?.data.errorMessage)
        return Promise.reject()
      }
    },
    enabled: currentState === 'success',
    onError(error: Error) {
      toast.error(error.message)
    }
  })

  return (
    <>
      <div className="bg-white h-[2000px] p-5 flex flex-col gap-10 mb-32 mt-5">
        <span className="flex items-center gap-5 font-bold text-xl">
          <CreditCardIcon />
          <span>Quản lý thanh toán</span>
        </span>

        {/* Tabbar */}
        <div className="block w-full border-[1px] border-gray-300 rounded-md">
          <ul className="flex cursor-pointer">
            {
              tabbar.adminManagePayment.map((tab, index) => (
                <li 
                  key={index} 
                  className="flex-1"
                  onClick={() => setCurrentState(tab.state)}
                >
                  <div className={cn("py-3 px-3 text-center transition-all duration-500", {
                    "bg-secondColor text-white font-semibold": tab.state.includes(currentState),
                    "hover:bg-blue-50": currentState !== tab.state,
                    "rounded-tl-md rounded-bl-md": index === 0,
                    "rounded-tr-md rounded-br-md": index === tabbar.adminManageCourses.length - 1
                  })}>
                    <span>{tab.display}</span>
                  </div>
                </li>
              ))
            }
          </ul>
        </div>
        {/* End tabbar */}

        <div className={cn("max-w-full",{
          "max-w-[calc(100vw-340px)] transition-all duration-1000": sidebarExpand === true,
        })}>
          {
            (adminPaymentPending.data && adminPaymentPending.data.content.length < 1)
            || (adminPaymentSuccess.data && adminPaymentSuccess.data.content.length < 1)
              ? (
                <div className='w-full h-80 rounded-xl p-10 flex flex-col items-center justify-center
                  gap-y-7'>
                  <Boxes className='w-14 h-14 stroke-gray-500'/>
                  <span className='text-gray-500 text-xl'>
                    {
                      currentState === 'pending'
                        ? "Không có thanh toán nào đang chờ"
                        : currentState === 'success'
                          ? "Chưa có thanh toán nào được thực hiện"
                          : ""
                    }
                  </span>
                </div>
              )
              : (
                <div>
                  {
                    adminPaymentPending.isLoading || adminPaymentSuccess.isLoading
                      ? <Skeleton />
                      :  <section className='bg-white border-[1px] border-gray-300 overflow-auto max-h-[500px] rounded-md'>
                          <table className='text-center [&>tbody>*:nth-child(odd)]:bg-gray-100 w-full
                          [&>thead>tr>th:nth-child(1)]:sticky [&>thead>tr>th:nth-child(1)]:left-0 [&>thead>tr>th:nth-child(1)]:z-50 
                          [&>thead>tr>th:nth-child(1)]:px-16 [&>tbody>tr>td:nth-child(1)]:sticky [&>tbody>tr>td:nth-child(1)]:left-0
                          [&>tbody>tr>td:nth-child(1)]:bg-inherit'>
                            <thead className='[&>tr>*]:sticky [&>tr>*]:top-0 [&>tr>*]:z-10 [&>tr>*]:bg-gray-200 text-black w-full'>
                              <tr>
                                  <th className='w-[15%] py-2 px-5 whitespace-nowrap border-r-2'>
                                    <span>Mã user</span>
                                  </th>
                                  <th className='py-2 px-5 whitespace-nowrap border-r-2'>
                                  </th>
                                  <th className='py-2 px-10 whitespace-nowrap border-r-2'>
                                    <span>Người dạy</span>
                                  </th>
                                  <th className='py-2 px-10 whitespace-nowrap border-r-2'>
                                    <span>Trạng thái</span>
                                  </th>
                                  <th className='py-2 px-5 whitespace-nowrap border-r-2'>
                                    <span>Cần thanh toán (VNĐ)</span>
                                  </th>
                                  <th className='py-2 px-10 whitespace-nowrap border-r-2'>
                                    <span>Thanh toán lúc</span>
                                  </th>
                                  <th className='py-2 px-10 whitespace-nowrap border-r-2'>
                                    <span>Thao tác</span>
                                  </th>
                              </tr>
                            </thead>
                            <tbody>
                              {
                                adminPaymentPending.data?.content.map((adminPayment, _) => (
                                  <AdminPaymentData key={adminPayment.id} adminPayment={adminPayment}  />
                                ))
                              }

                              {
                                adminPaymentSuccess.data?.content.map((adminPayment, _) => (
                                  <AdminPaymentData key={adminPayment.id} adminPayment={adminPayment}  />
                                ))
                              }
                            </tbody>
                          </table>
                        </section>
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
                      {/* {
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
                      } */}
                    </ul>
                    <Button 
                      variant='grey' 
                      // disabled={data?.last}
                      onClick={() => navigate(`/admin/users?page=${page + 1}`)}
                    >
                      Next
                    </Button>
                  </div>
                  {/* End navigate Page Action */}
                </div>
              )
          }
        </div>
      </div>
    </>
  )
}

export default AdminPaymentPage
