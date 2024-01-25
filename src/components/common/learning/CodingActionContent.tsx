import { useQuery } from "react-query"
import { useNavigate, useParams } from "react-router-dom"
import courseApi from "../../../api/modules/course.api"
import { toast } from "react-toastify"
import { useSelector } from "react-redux"
import { RootState } from "../../../redux/store"
import { CodingExercise } from "../../../types/model/CodingExercise"
import progressApi from "../../../api/modules/progress.api"
import ChapterSidebarItem from "../ChapterSidebarItem"
import { useState } from "react"
import { cn } from "../../../util/utils"
import CurriculumContent from "./CurriculumContent"
import CommentContent from "./CommentContent"
import NoteContent from "./NoteContent"
import OverviewContent from "./OverviewContent"
import ReviewContent from "./ReviewContent"

interface Props {
    codingEx?: CodingExercise
}

type TabState = 'content' | 'overview' | 'comment' | 'note' | 'review'

interface Tab {
    display: string,
    state: TabState
}

const tabs: Tab[] = [
    {
        display: "Nội dung khóa học",
        state: 'content'
    },
    {
        display: "Tổng quan",
        state: 'overview'
    },
    {
        display: "Hỏi đáp",
        state: 'comment'
    },
    {
        display: "Ghi chú",
        state: 'note'
    },
    {
        display: "Đánh giá",
        state: 'review'
    },
]

const CodingActionContent = ({ codingEx }: Props) => {
    const [currentState, setCurrentState] = useState<TabState>('content')
    
    return (
        <div className="flex flex-col w-[80%] mx-auto">
            <div className="flex justify-start items-center border-b border-b-gray-300 bg-white z-50">
                {
                    tabs.map(tab => (
                        <div 
                            key={tab.state} 
                            className={cn("px-5 py-3 cursor-pointer", {
                                'shadow-[inset_0px_-3px_0px_0px_rgba(0,0,0,0.75)]': tab.state === currentState
                            })}
                            onClick={() => setCurrentState(tab.state)}
                        >
                            {tab.display}
                        </div>
                    ))
                }
            </div>
            { currentState === 'content' && <CurriculumContent codingEx={codingEx} /> }
            { currentState === 'comment' && <CommentContent /> }
            { currentState === 'note' && <NoteContent /> }
            { currentState === 'overview' && <OverviewContent /> }
            { currentState === 'review' && <ReviewContent /> }
        </div>
    )
}

export default CodingActionContent
