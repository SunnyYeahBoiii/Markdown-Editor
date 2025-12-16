import { useState , useEffect } from "react";

function Clock({}){
    const [date , setDate] = useState(null)
    useEffect(() => {
        const intervalId = setInterval(() => {
            const current_date = new Date();
            const dateString = `${current_date.getHours() < 10 ? '0' : ''}${current_date.getHours()}:${current_date.getMinutes() < 10 ? '0' : ''}${current_date.getMinutes()}:${current_date.getSeconds() < 10 ? '0' : ''}${current_date.getSeconds()}`
            setDate(dateString)
        } , 1000);

        return () => {
            clearInterval(intervalId);
        }
    }, [])

    return (
        <>
            <p id='nav-item-right'>Time: {date}</p>
        </>
    )
}

export default Clock;