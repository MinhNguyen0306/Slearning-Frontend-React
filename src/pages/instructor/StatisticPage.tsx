import { PieChartIcon } from "lucide-react";
import Chart from "react-apexcharts";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import paymentApi from "../../api/modules/payment.api";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

const chartOptions: any = {
  series: [{
    name: 'Doanh thu',
    data: [40,70,95,20,50,10,15,20,80,10,25,65]
  }, {
    name: 'Lợi nhuận',
    data: [20,10,40,60,60,70,52,18,73,54,32,15]
  }], 
  options: {
    colors: ['#6ab04c', '#2980b9'],
    chart: {
      background: 'transparent',
    }, 
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      curve: 'smooth',
      width: 2,
    },
    xaxis: {
      categories: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
      title: {
        text: "Tháng"
      }
    },
    legend: {
      position: 'top'
    },
    grid: {
      show: false
    }
  }
}

const donutChartOptions: any = {
  series: [44, 55, 41, 17, 15],
  options: {
    colors: ['#429bf5', '#f54251', '#c5f542', '#42f5bf', '#f54251'],
    chart: {
    },
    plotOptions: {
      pie: {
        startAngle: -90,
        endAngle: 270
      }
    },
    dataLabels: {
      enabled: false
    },
    fill: {
      type: 'gradient',
    },
    legend: {
      position: 'top'
    },
    title: {
      text: 'Gradient Donut with custom Start-angle'
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  },
}

interface ProfitData {
  month: string,
  principalAmount: number,
  amountPaid: number
}

const StatisticPage = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const [profitCollection, setProfitCollection] = useState<ProfitData[]>([]);
  const [profitChartOpts, setProfitChartOpts] = useState<any>({
    series: [{
      name: 'Doanh thu',
      data: []
    }, {
      name: 'Lợi nhuận',
      data: []
    }], 
    options: {
      colors: ['#6ab04c', '#2980b9'],
      chart: {
        background: 'transparent',
      }, 
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        curve: 'smooth',
        width: 2,
      },
      xaxis: {
        categories: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
        title: {
          text: "Tháng"
        }
      },
      legend: {
        position: 'top'
      },
      grid: {
        show: false
      }
    }
  })

  const allMonthlyPaymentsOfUser = useQuery({
    queryKey: ['allMonthlyPayments', user.id],
    queryFn: async () => {
      const { response, error } = await paymentApi.getAllMonthlyPaymentsOfUser(user.id)
      if(response) {
        const principalAmounts = 
          response.data.content
            .filter(p => p.monthOfYear.split('-')[1] === String(new Date().getFullYear()))
            .sort((p1, p2) => Number(p1.monthOfYear.split("-")[0]) - Number(p2.monthOfYear.split("-")[0]))
        const principalResult = Array(12).fill(0)
        for(let i = 0; i < principalAmounts.length; i++) {
          principalResult.splice(Number(principalAmounts[i].monthOfYear.split("-")[1]) - 1, 0, principalAmounts[i].principalAmount)
        }

        const profitAmounts = 
          response.data.content
            .filter(p => p.monthOfYear.split('-')[1] === String(new Date().getFullYear()))
            .sort((p1, p2) => Number(p1.monthOfYear.split("-")[0]) - Number(p2.monthOfYear.split("-")[0]))
        const profitResult = Array(12).fill(0)
        for(let i = 0; i < profitAmounts.length; i++) {
          profitResult.splice(Number(profitAmounts[i].monthOfYear.split("-")[1]) - 1, 0, profitAmounts[i].amountPaid)
        }

        setProfitChartOpts({
          ...profitChartOpts,
          series: [{
            name: 'Doanh thu',
            data: profitResult
          }, {
            name: 'Lợi nhuận',
            data: principalResult
          }], 
        })
        return response.data.content.filter(p => p.monthOfYear.split('-')[1] === String(new Date().getFullYear()));
      }
      if(error) toast.error(error.response?.data.errorMessage ?? error.message)
    },
    onError(error: Error) {
      toast.error(error.message)
    }
  })

  return (
    <div className="flex flex-col gap-y-10 bg-white p-5 h-[1000px] mt-5">
      <div className="flex items-center justify-start gap-x-3">
        <PieChartIcon />
        <h1 className="font-bold text-xl">Thống kê</h1>
      </div>
      <div className="grid grid-cols-2 items-center gap-x-5">
        <div className="bg-white p-3 shadow-md shadow-gray-300 rounded-lg h-[300px]">
            <Chart 
              options={profitChartOpts.options}
              series={profitChartOpts.series}
              type="bar"
              height='100%'
            />
        </div>
        <div className="bg-white p-3 shadow-md shadow-gray-300 rounded-lg h-[300px]">
            <Chart 
              options={donutChartOptions.options}
              series={donutChartOptions.series}
              type="donut"
              height="100%"
            />
        </div>
      </div>
    </div>
  )
}

export default StatisticPage
