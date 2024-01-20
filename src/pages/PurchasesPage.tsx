import React from 'react'
import { useQuery } from 'react-query'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import paymentApi from '../api/modules/payment.api'
import { toast } from 'react-toastify'
import Skeleton from '../components/Skeleton'
import PurchaseItem from '../components/common/PurchaseItem'

const PurchasesPage = () => {
  const user = useSelector((state: RootState) => state.user.user)

  const purchaseQuery = useQuery({
    queryKey: ['paymentsOfUser', user.id],
    queryFn: async () => {
      if(user.id) {
        return await paymentApi.getPaymentOfUser(user.id)
      } else {
        return Promise.reject();
      }
    },
    onSuccess(data) {
      if(data.response) return data.response.data
      if(data.error) toast.error(data.error.response?.data.errorMessage)
    }, 
    onError(error: Error) {
      toast.error(error.message)
    }
  })

  return (
    <div className='w-full bg-white rounded-md p-10 overflow-y-scroll'>
      {/* Purchases Page */}
      {
        purchaseQuery.isLoading
          ? <Skeleton />
          : <div className='flex flex-col gap-y-5'>
            {
              purchaseQuery.data?.response?.data &&
              (
                purchaseQuery.data.response.data.content.map((payment, _) => (
                  <PurchaseItem key={payment.id} payment={payment} />
                ))
              )
            }
          </div>
      }
      {
        purchaseQuery.data?.response?.data.content.length === 0 &&
        <span>Chưa có lịch sử thanh toán</span>
      }
    </div>
  )
}

export default PurchasesPage
