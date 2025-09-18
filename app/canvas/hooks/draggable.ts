import { useEffect, useState } from "react";


export function useKeyHold(key: string) {
    const [held, setHeld] = useState(false);
    useEffect(() => {
        const down = (e: KeyboardEvent) => e.key === key && setHeld(true);
        const up = (e: KeyboardEvent) => e.key === key && setHeld(false);
        document.addEventListener("keydown", down);
        document.addEventListener("keyup", up);
        return () => {
            document.removeEventListener("keydown", down);
            document.removeEventListener("keyup", up);
        };
    }, [key]);
    return held;
}