import { useEffect, useState } from "react";

const useClickOutSide = (initialState: boolean, element:React.RefObject<HTMLElement>, type:'box'|'dropdown') => {
    const [open, setOpen] = useState<boolean>(initialState);

    const setOpenStatus = (value: boolean) => setOpen(value);

    useEffect(() => {
        let handler = (event: MouseEvent) => {
            const e = event.target as HTMLElement   
            if(element.current !== null) {
                if(!element.current.contains(e) || e.contains(element.current) && open && type === 'dropdown') {
                    setOpen(false);
                } else if(open) {
                    setOpen(false)
                } else {
                    setOpen(true)
                }
            }
        };

        document.addEventListener("mousedown", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
        }
    });

    return [open, setOpenStatus] as const;
}

export default useClickOutSide;