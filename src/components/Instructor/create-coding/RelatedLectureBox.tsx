import { useQuery } from "react-query"
import DropdownMenu from "../../DropdownMenu"
import { useParams } from "react-router-dom"
import codingApi from "../../../api/modules/coding.api"

const RelatedLectureBox = ({ onChange }: { onChange: (id: string) => void }) => {
    const { quizId } = useParams()

    const exQuery = useQuery({
        queryKey: ['exQuery'],
        queryFn: async () => {
            if(quizId) {
                const { response, error } = await codingApi.getById(Number(quizId))
                if(response) return response.data
                if(error) {
                    return Promise.reject()
                }
            } else {
                return Promise.reject()
            }
        }
    })

    return (
        <>
            <p>
                Cung cấp bài giảng liên quan như một tham chiếu để người học biết họ cần phải làm gì để giải quyết bài tập.
                Chọn bài giảng bạn muốn hiên thị.
            </p>
            <DropdownMenu
                name="relatedLecture"
                label="Chọn bài giảng liên quan"
                valueKey="id"
                displayKey="title"
                variant={'noneRounded'}
                dataset={exQuery.data?.chapter.lectures ?? []}
                onChange={(id) => onChange(id)}
            />
        </>
    )
}

export default RelatedLectureBox
