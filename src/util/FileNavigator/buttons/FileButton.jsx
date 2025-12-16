import {useEffect, useRef} from 'react'
import './FileButton.css'

export function FileButton({file , buttonText , className , fileRenderer}){
    const cloneRef = useRef(null)
    let hDiff = 0;
    let vDiff = 0;
    let downPosX = 0;
    let downPosY = 0;

    const handleDrag = (e) => {
        cloneRef.current.style.left = `${e.clientX- hDiff}px`;
        cloneRef.current.style.top = `${e.clientY - vDiff}px`;
    }

    const handleMouseDown = (e) => {
        console.log('Down');
        cloneRef.current.style.height = 'auto';
        cloneRef.current.style.width = 'auto';
        cloneRef.current.style.backgroundColor = 'gray';
        cloneRef.current.style.padding = '10px';
        const rect = e.target.getBoundingClientRect();
        hDiff = e.clientX - rect.left;
        vDiff = e.clientY - rect.top;
        downPosX = e.clientX;
        downPosY = e.clientY;
        console.log(e.target.offsetLeft , e.target.offsetTop)
        cloneRef.current.style.left = `${e.clientX - hDiff}px`;
        cloneRef.current.style.top = `${e.clientY - vDiff}px`;

        document.addEventListener('mousemove' , handleDrag)
        document.addEventListener('mouseup' , handleMouseUp)
    }
    
    const handleMouseUp = (e) => {
        if(e.clientX == downPosX && e.clientY == downPosY){
            console.log('File upload' , file)
            fileRenderer(file.file);
        }

        console.log('Up');
        cloneRef.current.style.height = '0px';
        cloneRef.current.style.width = '0px';
        cloneRef.current.style.left = `0px`;
        cloneRef.current.style.top = `0px`;
        cloneRef.current.style.backgroundColor = 'transparent';
        cloneRef.current.style.padding = '0px';
        document.removeEventListener('mouseup' , handleMouseUp)
        document.removeEventListener('mousemove' , handleDrag)
    }   

    useEffect(() => {
        console.log("NGU" , file)
    } , [])

    return (<>
        <button className={className}
        style ={{
            border: `none`,
            outline: `none`,
            backgroundColor: `transparent`,
            cursor: `pointer`,
        }}
        onMouseDown={handleMouseDown}
        
        >{buttonText}</button>
        <button ref = {cloneRef} className={'file-button-clone'}
        style={{
            position: 'fixed',
            display: 'inline-block',
            left: '-1px',
            top: '-1px',
            height: '0px',            
            width: '0px',
            
            padding: '0px',
            margin: '0px' ,
            border: 'none',
            outline: 'none',
            backgroundColor: 'transparent',
            content: '',
            overflow: 'hidden',
            zIndex: '9999',
            whiteSpace: 'nowrap',
            borderRadius: '5px',
            cursor: 'grab',
        }}
        
        >{buttonText}</button>
    </>);
}