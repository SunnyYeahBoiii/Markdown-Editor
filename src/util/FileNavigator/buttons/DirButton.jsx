import {useState , useEffect , useRef} from 'react'
import { HorizontalLine } from './horizontalLine';
import { FileButton } from './FileButton';

export function DirButton({fileRenderer, childList , id , className , buttonText}){
    const [open , setOpen] = useState(false);
    const [childContent , setChildContent] = useState(null);
    const [loadLine , setLoadLine] = useState(false);
    const dirRef = useRef(null);

    const renderChild = (child) => {
        console.log(child)
        if(child.file){
            console.log(child.file)
            return (<div style={{
                marginLeft: `2rem`,
            }} className={"dir"}>
                <FileButton fileRenderer={fileRenderer} file={child} buttonText={child.name} className={"dir-name"} />
            </div> 
            );
        }else{
            return (<>
                <div  style={{
                    marginLeft: `2rem`,
                }} className={"dir"}>
                    <DirButton childList={structuredClone(child.childs)} onClick={handleDirButton} className={"dir-name"} buttonText={'\\' + child.name}/>
                </div>
            </>);
        }
    }

    const handleDirButton = () => {
        setChildContent(1);
        setOpen(!open);
    }

    useEffect(() => {
        if(childContent !== null){
            let ele = dirRef.current;
            let elePar = ele.parentElement;
            
            if(open == true){
                let eleParLastChild = elePar.querySelector('div')
                let eleParLastChildLast = elePar.querySelector(':scope > div > div:last-child')
                let line = eleParLastChild.querySelector('.horizontal-line')
                let eleParLastChildLastButton = elePar.querySelector(':scope > div > div:last-child button')
                line.style.height = `${eleParLastChildLast.offsetTop - line.offsetTop + eleParLastChildLastButton.offsetHeight / 2}px`
                console.log("NGU" , elePar.parentElement.parentElement.parentElement)
            }

            ele = elePar.parentElement.parentElement.parentElement;
            console.log(ele);
            while(ele != null && (ele.classList.contains('dir') || ele.classList.contains('root'))){
                console.log('nav' , ele);
                let eleParLastChild = ele.querySelector('div')
                let eleParLastChildLast = ele.querySelector(':scope > div > div:last-child')
                let line = eleParLastChild.querySelector('.horizontal-line')
                let eleParLastChildLastButton = ele.querySelector(':scope > div > div:last-child button')
                line.style.height = `${eleParLastChildLast.offsetTop - line.offsetTop + eleParLastChildLastButton.offsetHeight / 2}px`
                console.log("NGU" , ele.parentElement.parentElement.parentElement)
                ele = ele.parentElement.parentElement.parentElement;
            }
        }
    } , [open]);

    return (<>
        <button ref={dirRef} id={id} className={className} onClick={() => {handleDirButton()}}
        style={{
            backgroundColor: 'white',
            cursor: `pointer`,
            outline: 'none',
            border: 'none',
        }}>{buttonText}</button>
        {open && <>
            <div>
            <HorizontalLine height={0}/>
            {
                childList.map(child => {
                    return (<div key={child.name}>
                        {
                            renderChild(child)
                        }
                    </div>);
                })  
            }
            </div>
        </>}
    </>);
}   