import { useState, useEffect, useRef } from "react"
import { SidePanel } from "./sidePanel";

export function NavBar({textRef}){
    const [date , setDate] = useState(null)
    const sideRef = useRef(null)
    const [panelOpen , setPanelOpen] = useState(false);

    const [sidePanelStyle , setSidePanelStyle] = useState({
        borderRight: '1px solid black',
        height: '100vh',
        position: 'fixed',
        left: '0',
        margin: '0',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        padding: '20px',
        zIndex: '100',
        transform: 'translateX(-100%)',
        transition: 'transform 0.5s ease',
    });

    const intervalId = setInterval(() => {
        const current_date = new Date();
        const dateString = `${current_date.getHours() < 10 ? '0' : ''}${current_date.getHours()}:${current_date.getMinutes() < 10 ? '0' : ''}${current_date.getMinutes()}:${current_date.getSeconds() < 10 ? '0' : ''}${current_date.getSeconds()}`
        setDate(dateString)
    } , 1000);

    const handlePanelButton = () => {
        openPanel();
        console.log(textRef);
    }

    const closePanel = () => {
        setPanelOpen(false)
        setSidePanelStyle(prevStyle => {
            return {...prevStyle , transform: 'translateX(-100%)'};
        })
    }

    const openPanel = () => {
        setPanelOpen(true)
        setSidePanelStyle(prevStyle => {
            return {...prevStyle , transform: 'translateX(0%)'};
        })
    }
    
    return (
        <>
            <div id="nav-bar">
                <p id='nav-item-left' onClick={handlePanelButton}>  Side Panel</p>
                <SidePanel textRef={textRef} style={sidePanelStyle} closeFunc={() => {
                    setPanelOpen(false)
                    setSidePanelStyle(prevStyle => {return {...prevStyle , transform: 'translateX(-100%)'};
                })}}/>
                <p id='nav-item-center'>Markdown Editor</p>
                <p id='nav-item-right'>Time: {date}</p>
            </div>  
        </>
    );
}