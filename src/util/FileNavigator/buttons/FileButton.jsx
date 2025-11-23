
export function FileButton({fileRenderer, file , buttonText , className}){
    return (<>
        <button 
        className={className}
        style ={{
            border: `none`,
            outline: `none`,
            backgroundColor: `white`,
            cursor: `pointer`,
            margin: `2px`,
        }}
        onClick={() => fileRenderer(file)}
        >{buttonText}</button>
    </>);
}