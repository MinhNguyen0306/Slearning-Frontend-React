import { StarIcon } from "lucide-react";
import { forwardRef, useEffect, useMemo, useState } from "react";
import { cn } from "../util/utils";
import { VariantProps, cva } from "class-variance-authority";

const ratingVariants = cva(
    "block",
    {
        variants: {
            variant: {
                default: "stroke-none",
                outline: "stroke-ratingColor"
            },
            size: {
                default: "w-6 h-6",
                small: "w-4 h-4",
                xsmall: "w-3 h-3"
            }
        },
        defaultVariants: {
            variant: "default",
            size: "default"
        }
    }
)

interface RatingProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof ratingVariants> {
    rating: number,
    readOnly?: boolean,
    onRating?: (index: number) => void,
    colorRating?: {
        filled: string,
        unfilled: string
    }
}

const Rating = forwardRef<HTMLDivElement, RatingProps>(({
    rating, readOnly, onRating, className, variant, size, colorRating = {filled: "#fcba03", unfilled: "#ffffff"}, ...props
}, ref) => {
    const [hoverRating, setHoverRating] = useState<number>(0)

    const getcolorRating = (index: number) => {
        if(hoverRating >= index) {
            return colorRating.filled;
        } else if(!hoverRating && rating >= index) {
            return colorRating.filled;
        }
        
        return colorRating.unfilled;
    }

    const starRating = useMemo(() => {
        return Array(5).fill(0).map((_, i) => i + 1).map(index => (
            <StarIcon key={index}
                className={cn(ratingVariants({className, variant, size}), 'cursor-pointer', {
                    "fill-none" : getcolorRating(index) === colorRating.unfilled
                })}
                style={{ fill: getcolorRating(index) }}
                onClick={() => onRating ? onRating(index) : null}
                onMouseEnter={() => setHoverRating(index)}
                onMouseLeave={() => setHoverRating(0)}
            />
        ))
    }, [rating, hoverRating])

    const starDisplay = useMemo(() => {
        return Array(5).fill(0).map((_, i) => i + 1).map(index => {
            return (
                <div key={index}>
                    <StarIcon
                        className={cn(ratingVariants({className, variant, size}), 'fill-ratingColor', {
                            'fill-none': index > rating
                        })}
                    />
                </div>
        )})
    }, [rating])

    return (
        <div ref={ref} className="flex text-gray-200" {...props}>
            {readOnly ? starDisplay : starRating}
        </div>
    )
})

export default Rating
