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
        textRef.current.style.display = 'none';
        previewRef.current.style.display = 'none';
       document.addEventListener('mousemove' , handleDrag) 
    }

    const handleMouseUp = () => {
        document.removeEventListener('mousemove' , handleDrag) 
        textRef.current.style.display = 'block';
        previewRef.current.style.display = 'block';
    }

    return (
        <div ref={lineAreaRef} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} id = "mid-line-area">
            <div id = "mid-line"></div>
        </div>
    );
}

export default DragLine;