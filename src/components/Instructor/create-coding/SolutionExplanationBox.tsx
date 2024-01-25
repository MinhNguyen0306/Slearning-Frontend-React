import ReactQuill from "react-quill";

const modules = {
    toolbar: [
        [{ 'header': [1, 2, false] }],
        ['bold', 'italic', 'underline','strike', 'blockquote'],
        [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
        ['link', 'image', 'code-block'],
        ['clean']
    ]
}
    
const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'code-block'
]

const SolutionExplanationBox = ({ onChange, solutionExplanation }: { onChange: (v: string) => void, solutionExplanation: string }) => {
    return (
        <>
            <p>
                Giải thích giải pháp sẽ mở khóa sau lần thứ 3 người học ra kết quả sai. Bạn có thể viết mã giải pháp và
                giải thích từng bước một để cho ra kết quả của bài tập.
            </p>
            <ReactQuill
                theme='snow'
                value={solutionExplanation}
                onChange={(e) => onChange(e)}
                placeholder="Thêm giải thích"
                modules={modules}
                formats={formats}
            />
    </>
    )
}

export default SolutionExplanationBox
