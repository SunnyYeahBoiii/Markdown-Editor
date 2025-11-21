import { text } from 'incremental-dom';
import { useState, useRef } from 'react';

function DragLine({previewRef , textRef}){
    const lineAreaRef = useRef(null);

    const handleDrag = (e) => {
        lineAreaRef.current.style.left = `${e.clientX}px`;
        textRef.current.style.width = `${e.clientX - 5}px`;
        previewRef.current.style.width = `calc(100vw - ${e.clientX + 10}px)`;

    }

    const handleMouseDown = () => {
       document.addEventListener('mousemove' , handleDrag) 
    }

    const handleMouseUp = () => {
        document.removeEventListener('mousemove' , handleDrag) 
    }

    return (
        <div ref={lineAreaRef} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} id = "mid-line-area">
            <div id = "mid-line"></div>
        </div>
    );
}

export default DragLine;