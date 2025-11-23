import {useState} from 'react'

export function DirButton({onClick , id , className , buttonText}){
    const [open , setOpen] = useState(false);

    const handleDirButton = () => {
    }

    return (<>
        <button id={id} className={className} onClick={() => onClick(id)}
        style={{
            backgroundColor: 'white',
            cursor: `pointer`,
            outline: 'none',
            border: 'none',
            margin: '2px'
        }}>{buttonText}</button>
    </>);
}   