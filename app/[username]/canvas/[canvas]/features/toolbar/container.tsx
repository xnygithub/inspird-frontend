import React from 'react'
import { KonvaCanvasHandle } from '../KonvaCanvas';
import ImportPosts from '../../components/import';

interface Props {
    canvasRef: React.RefObject<KonvaCanvasHandle | null>;
}
const ToolbarContainer = ({ canvasRef }: Props) => {
    return (
        <div className="right-1/2 bottom-4 absolute p-4 translate-x-1/2">
            <ImportPosts canvasRef={canvasRef} />
        </div>
    )
}

export default ToolbarContainer