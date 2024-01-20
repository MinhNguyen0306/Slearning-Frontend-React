import { cn, getImage } from '../../../util/utils'
import { AdminPaymentStatus } from '../../../types/payload/enums/AdminPaymentStatus'
import { format } from 'date-fns';
import { Button } from '../../../components/Button';
import paymentApi from '../../../api/modules/payment.api';
import { toast } from 'react-toastify';
import { InfoIcon } from 'lucide-react';
import { Tooltip } from 'react-tooltip';
import { AdminPayment } from '../../../types/model/AdminPayment';

const AdminPaymentData = ({ adminPayment }: { adminPayment: AdminPayment }) => {
  console.log(adminPayment)

  const handlePayment = async () => {
    try {
      const { response, error } = await paymentApi.vnpayAdmin(adminPayment.amount, adminPayment.id)
      if(response) {
          window.location.href = response.data
      } else {
          toast.error(error.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <tr>
      <td className='py-3'>
        <span 
          className="w-3/4 overflow-hidden text-ellipsis whitespace-nowrap inline-block"
        >
          { adminPayment.id }
        </span>
      </td>
      <td className='py-3'>
        <div className='grid place-items-center w-[100px]'>
          <img 
            src={adminPayment.user.avatar ? getImage(adminPayment.user.avatar.url) : ""} 
            alt="" 
            className='w-10 h-10 rounded-full'
          />
        </div>
      </td>
      <td className='py-3'>
        { adminPayment.user.fullName }
      </td>
      <td className='py-3'>
        <span className="flex items-center justify-center gap-x-2">
          <i className={cn("w-2 h-2 rounded-full ", {
            "bg-pending": adminPayment.adminPaymentStatus === AdminPaymentStatus.PENDING,
            "bg-active": adminPayment.adminPaymentStatus === AdminPaymentStatus.SUCCESS,
          })}></i>
          { adminPayment.adminPaymentStatus === 'PENDING' 
            ? "Chờ thanh toán" 
              : adminPayment.adminPaymentStatus === 'SUCCESS' 
                ? 'Đã thanh toán' 
                : "Còn nợ" 
          }
        </span>
      </td>
      <td className='py-3'>
        <div className='max-w-100px'>
          <span>{ adminPayment.amount }</span>
        </div>
      </td>
      <td className='py-3'>
        <div className='max-w-100px'>
          <span>
            { adminPayment.paymentAt ? format(new Date(adminPayment.paymentAt), "dd-MM-yyyy hh:mm:ss") : "Chưa thanh toán" }
          </span>
        </div>
      </td>
      <td className='py-3'>
        <div className='grid place-items-center'>
          {
            adminPayment.adminPaymentStatus === 'PENDING'
              ? <Button size='sm' variant='warning' rounded='md' onClick={handlePayment}>
                  Thanh toán
                </Button>
              : <div 
                  data-tooltip-id='detail'
                  data-tooltip-content="Xem chi tiet"
                  className='grid place-items-center text-mainColor cursor-pointer rounded-full hover:bg-mainColorHover w-10 h-10'
                >
                  <InfoIcon />
                  <Tooltip id='detail' className='z-50'/>
                </div>
          }
        </div>
      </td>
    </tr>
  )
}

export default AdminPaymentData
