import { format } from 'date-fns'
import { Boxes, CoinsIcon, CreditCardIcon, FileSpreadsheetIcon } from 'lucide-react'
import { useQuery } from 'react-query'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import paymentApi from '../../api/modules/payment.api'
import { toast } from 'react-toastify'
import useQueryString from '../../hooks/useQueryString'
import { PageRequest } from '../../types/payload/PageRequest'
import Skeleton from '../../components/Skeleton'
import { cn, numberWithCommas } from '../../util/utils'
import { AdminPaymentStatus } from '../../types/payload/enums/AdminPaymentStatus'
import { Button } from '../../components/Button'
import { Tooltip } from 'react-tooltip'
import { BASE_URL } from '../../api/config/private.client'
import SellerPaymentModal from '../../components/modal/SellerPaymentModal'
import { setSellerPaymentModalOpen } from '../../redux/features/appState/appState.slice'

const PaymentPage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const { sidebarExpand } = useSelector((state: RootState) => state.appState)

  const monthlyPaymentOfUser = useQuery({
    queryKey: ['monthlyPaymentOfUser', user.id],
    queryFn: async () => {
      const { response, error } = await paymentApi.getMonthlyPaymentOfUser(user.id, format(Date.now(), "MM-yyyy"))

      if(response) {
        return response.data
      }

      if(error) toast.error(error.response?.data.errorMessage ?? error.message)
    },
    onError(error: Error) {
      toast.error(error.message)
    }
  })

  const queryString: { page?: string } = useQueryString();
  const page = queryString.page ? Number(queryString.page) : 0

  const allMonthlyPaymentsOfUser = useQuery({
    queryKey: ['allMonthlyPayments', user.id, page],
    queryFn: async () => {
      const pageRequest: PageRequest = { pageNumber: page, pageSize: 5 }
      const { response, error } = await paymentApi.getAllAdminPaymentsOfUser(user.id, pageRequest)

      if(response) {
        return response.data
      }

      if(error) toast.error(error.response?.data.errorMessage ?? error.message)
    },
    onError(error: Error) {
      toast.error(error.message)
    }
  })

  const currentMonthRevenue = useQuery({
    queryKey: ['currentMonthRevenue', user.id],
    queryFn: async () => {
      const { response, error } = await paymentApi.getCurrentRevenueOfMentor(user.id)
      if(response) {
        return response.data
      }
      if(error) {
        return Promise.reject()
      }
    }
  })

  function handleExportMonthlyPayment(monthlyPaymentId: string) {
    fetch(`${BASE_URL}/payments/payments-in-month/excel?monthlyPaymentId=${monthlyPaymentId}`)
      .then(response => {
        toast.success("Đã xuất report")
        return response.blob()
      })
      .then(blob => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `Hoa_don_thang_${monthlyPaymentId}.xlsx`;
        link.click();
      })
      .catch((error: Error) => toast.error(error.message));
  }

  return (
    <>
      <SellerPaymentModal />
      <div className="bg-white h-[2000px] p-10 flex flex-col gap-10 mb-32 mt-5">
        <span className="flex items-center gap-5 font-bold text-xl">
          <CreditCardIcon />
          <span>Quản lý thanh toán</span>
        </span>
        
        <div className='rounded-md p-5 border border-gray-300 shadow-md shadow-gray-200 grid grid-cols-2 gap-x-5'>
          <div className='flex flex-col gap-y-3'>
            <h2 className='font-bold text-lg'>Thêm liên kết tài khoản ngân hàng</h2>
            <div className='h-full grid place-items-center'>
              <CreditCardIcon className='w-14 h-14 stroke-[1.25px]'/>
            </div>
          </div>
          <div className='flex flex-col gap-y-5'>
            <div className='flex items-center justify-start gap-x-3'>
              <span className='w-[190px]'>Doanh thu tháng hiện tại</span>
              <span>
                { currentMonthRevenue.data ? numberWithCommas(currentMonthRevenue.data) : 0 } VNĐ
              </span>
            </div>
            <div className='flex items-center justify-start gap-x-3'>
              <span className='w-[190px]'>Số dư</span>
              <span>{ user.accountBalance ? numberWithCommas(user.accountBalance.userBalance) : 0 } VNĐ</span>
            </div>
            <Button rounded={'md'} className='w-fit' onClick={() => dispatch(setSellerPaymentModalOpen(true))}>
              <div className='flex items-center justify-center gap-x-3'>
                <CoinsIcon />
                <span>Yêu cầu thanh toán</span>
              </div>
            </Button>
          </div>
        </div>

        <div className={cn("max-w-full",{
          "max-w-[calc(100vw-340px)] transition-all duration-1000": sidebarExpand === true,
        })}>
          {
            (allMonthlyPaymentsOfUser.data && allMonthlyPaymentsOfUser.data.content.length < 1)
              ? (
                <div className='w-full h-80 rounded-xl p-10 flex flex-col items-center justify-center
                  gap-y-7 border border-gray-300'>
                  <Boxes className='w-14 h-14 stroke-gray-400 stroke-[1.25px]'/>
                  <span className='text-gray-500 text-xl'>
                    Không có lịch sử giao dịch
                  </span>
                </div>
              )
              : (
                <div>
                  {
                    allMonthlyPaymentsOfUser.isLoading
                      ? <Skeleton />
                      :  <section className='bg-white border-[1px] border-gray-300 overflow-auto max-h-[500px] rounded-md'>
                          <table className='text-center [&>tbody>*:nth-child(odd)]:bg-gray-100 w-full
                          [&>thead>tr>th:nth-child(1)]:sticky [&>thead>tr>th:nth-child(1)]:left-0 [&>thead>tr>th:nth-child(1)]:z-50 
                          [&>thead>tr>th:nth-child(1)]:px-16 [&>tbody>tr>td:nth-child(1)]:sticky [&>tbody>tr>td:nth-child(1)]:left-0
                          [&>tbody>tr>td:nth-child(1)]:bg-inherit'>
                            <thead className='[&>tr>*]:sticky [&>tr>*]:top-0 [&>tr>*]:z-10 [&>tr>*]:bg-gray-200 text-black w-full'>
                              <tr>
                                  <th className='w-[15%] py-2 px-5 whitespace-nowrap border-r-2'>
                                    <span>Mã thanh toán</span>
                                  </th>
                                  <th className='w-[15%] py-2 px-5 whitespace-nowrap border-r-2'>
                                    <span>Tháng thanh toán</span>
                                  </th>
                                  <th className='py-2 px-10 whitespace-nowrap border-r-2'>
                                    <span>Trạng thái</span>
                                  </th>
                                  <th className='py-2 px-10 whitespace-nowrap border-r-2'>
                                    <span>Số tiền rút (VNĐ)</span>
                                  </th>
                                  <th className='py-2 px-10 whitespace-nowrap border-r-2'>
                                    Thanh toán lúc
                                  </th>
                                  <th className='py-2 px-10 whitespace-nowrap border-r-2'>
                                    <span>Thao tác</span>
                                  </th>
                              </tr>
                            </thead>
                            <tbody>
                              {
                                allMonthlyPaymentsOfUser.data?.content.map((payment, _) => (
                                  <tr key={payment.id}>
                                    <td className='py-3'>
                                      <span 
                                        className="w-3/4 overflow-hidden text-ellipsis whitespace-nowrap inline-block"
                                      >
                                        { payment.id }
                                      </span>
                                    </td>
                                    <td className='py-3'>
                                      <span 
                                        className="w-3/4 overflow-hidden text-ellipsis whitespace-nowrap inline-block"
                                      >
                                        { payment.monthOfYear }
                                      </span>
                                    </td>
                                    <td className='py-3'>
                                      <span className="flex items-center justify-center gap-x-3">
                                        <i className={cn("w-3 h-3 rounded-full ", {
                                          "bg-pending": payment.adminPaymentStatus === AdminPaymentStatus.PENDING,
                                          "bg-active": payment.adminPaymentStatus === AdminPaymentStatus.SUCCESS,
                                        })}></i>
                                        { payment.adminPaymentStatus === 'PENDING' 
                                          ? "Chờ thanh toán" 
                                            : payment.adminPaymentStatus === 'SUCCESS' 
                                              ? 'Đã thanh toán' 
                                              : "Thất bại" 
                                        }
                                      </span>
                                    </td>
                                    <td className='py-3'>
                                      <div className='max-w-100px'>
                                        <span>{ numberWithCommas(payment.amount) }</span>
                                      </div>
                                    </td>
                                    <td className='py-3'>
                                      <span>{ payment.paymentAt ? payment.paymentAt : "Chưa thanh toán" }</span>
                                    </td>
                                    <td className='py-3'>
                                      <div 
                                        data-tooltip-id='excel'
                                        data-tooltip-content='Xem các hóa đơn tháng này'
                                        className='grid place-items-center'
                                      >
                                        <Button variant='green' rounded='md' onClick={() => handleExportMonthlyPayment(payment.id)}>
                                          <div className='flex items-center gap-x-2'>
                                            <FileSpreadsheetIcon />
                                            <span>
                                              Xuất file
                                            </span>
                                          </div>
                                        </Button>
                                        <Tooltip id='excel' className='z-50'/>
                                      </div>
                                    </td>
                                  </tr>
                                ))
                              }
                            </tbody>
                          </table>
                        </section>
                  }

                
                </div>
              )
          }
        </div>
      </div>
    </>
  )
}

export default PaymentPage
