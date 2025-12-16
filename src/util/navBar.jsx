import { useState, useEffect, useRef } from "react"
import { SidePanel } from "./sidePanel";
import Clock from './FileNavigator/Clock'

export function NavBar({previewRef , textRef}){
    
    const [panelOpen , setPanelOpen] = useState(false);
    
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
                <Clock></Clock>
            </div>  
        </>
    );
}