import { useState, useEffect, useRef } from "react"
import { SidePanel } from "./sidePanel";

export function NavBar({previewRef , textRef}){
    const [date , setDate] = useState(null)
    const [panelOpen , setPanelOpen] = useState(false);
    
    useEffect(() => {
        const intervalId = setInterval(() => {
            const current_date = new Date();
            const dateString = `${current_date.getHours() < 10 ? '0' : ''}${current_date.getHours()}:${current_date.getMinutes() < 10 ? '0' : ''}${current_date.getMinutes()}:${current_date.getSeconds() < 10 ? '0' : ''}${current_date.getSeconds()}`
            setDate(dateString)
        } , 1000);

        return () => {
            clearInterval(intervalId);
        }
    })

    const handlePanelButton = () => {
        openPanel();
    }

    const closePanel = () => {
        const ele = document.getElementById("side-panel");
        if(ele === null) return;

        ele.style.transform = 'translateX(-100%)';
        setPanelOpen(false) 
    }

    const openPanel = () => {
        const ele = document.getElementById("side-panel");
        if(ele === null) return;

        ele.style.transform = 'translateX(0%)';
        setPanelOpen(true);
    }
    
    return (
        <>
            <div id="nav-bar">
                <p id='nav-item-left' onClick={handlePanelButton}>  Side Panel</p>
                <SidePanel previewRef={previewRef} textRef={textRef} closeFunc={() => {
                    closePanel();
                }}/>
                <p id='nav-item-center'>Markdown Editor</p>
                <p id='nav-item-right'>Time: {date}</p>
            </div>  
        </>
    );
}