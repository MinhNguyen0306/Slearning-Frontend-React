import { useQuery } from 'react-query'
import { Payment } from '../../types/model/Payment'
import { format } from 'date-fns'
import courseApi from '../../api/modules/course.api'
import { toast } from 'react-toastify'

const PurchaseItem = ({ payment }: { payment: Payment }) => {

  const getCourseQuery = useQuery({
    queryKey: ['getCourseOfPayment', payment.id],
    queryFn: () => courseApi.getByPayment(payment.id),
    onSuccess(data) {
      if(data.error) toast.error(data.error.response?.data.errorMessage)
    },
    onError(error: Error) {
      toast.error(error.message)
    }
  })

  return (
    <div className='w-full border border-gray-300 p-3 rounded-md flex justify-between items-center'>
      <div className='flex flex-col gap-y-1 justify-start items-start'>
        <h2 className='font-bold'>
          { getCourseQuery.data?.response?.data.title }
        </h2>
        <span>
          Tác giả: { getCourseQuery.data?.response?.data.user?.fullName }
        </span>
        <span>
          Mã thanh toán: { payment.id }
        </span>
        <span>
          Thanh toán vào ngày { payment.updateAt && format(new Date(payment.updateAt), "dd-MM-yyyy") } lúc { payment.updateAt && format(new Date(payment.updateAt), "hh:mm a") }
        </span>
      </div>
      <div className='h-full font-bold'>
        { payment.amount } VNĐ
      </div>
    </div>
  )
}

export default PurchaseItem
