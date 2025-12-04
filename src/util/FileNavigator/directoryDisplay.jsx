import { Fragment , useEffect, useRef } from "react";
import {HorizontalLine} from "./horizontalLine.jsx"
import { DirButton } from "./buttons/DirButton.jsx";
import { FileButton } from "./buttons/FileButton.jsx";

export function DirectoryDisplay({fileRenderer, directoryTree}){
    let lastOffset = null;

    const handleDirButton = (nodeId) => {
        console.log(nodeId)
        let element = document.getElementById(nodeId);
        let elementChilds = element.parentElement.querySelector(":scope > div:last-of-type");
        elementChilds.classList.toggle("hidden");
        element = element.parentElement;
        while(element !== null){
            while( element !== null && !element.classList.contains('dir') && !element.classList.contains('root')){
                element = element.parentElement;
            }
            if(element === null) break;

            const lastDir = element.querySelector(":scope > div > div:last-child")
            if(lastDir === null)
                continue;
            const nodeLine = element.querySelector(":scope > div > .horizontal-line")
            nodeLine.style.height = `${lastDir.offsetTop}px`;

            element = element.parentElement;
        }
    }

    let dirId = 0;
    let fileId = 0;

    const renderDirectoryTree = (directoryTree , depth) => {
        if(directoryTree.length === 0) return (<></>);
        if(directoryTree.file?.kind == 'file'){
            return (<div style={{
                marginLeft: `2rem`,
            }} className={depth > 1 ? "dir" : "root"}>
                <FileButton fileRenderer={fileRenderer}file={directoryTree.file} buttonText={directoryTree.name} className={depth > 1 ? "dir-name" : ""} />
            </div> 
           );
        }

        return (
            <div  style={{
                marginLeft: `${depth > 1 ? "2rem" : ""}`,
            }} className={depth > 1 ? "dir" : "root"}>
                <DirButton id={`dir${dirId++}`} onClick={handleDirButton} className={depth > 1 ? "dir-name" : ""} buttonText={directoryTree.name}/>
                <div className={depth > 1 ? "hidden" : ""}>
                <HorizontalLine height={0}/>
                {
                    directoryTree.childs.map(child => {
                        return (<div key={child.name}>
                            {renderDirectoryTree(child, depth + 1)}
                        </div>);
                    })
                }
                </div>
            </div>
        );
    }

    useEffect(() => {
        const nodeList = document.querySelectorAll(".dir , .root");
        for (let i = 0 ; i < nodeList.length ; i++){
            // console.log(nodeList[i]);
            const lastDir = nodeList[i].querySelector(":scope > div > div:last-child")
            if(lastDir === null)
                continue;
            const nodeLine = nodeList[i].querySelector(":scope > div > .horizontal-line")
            nodeLine.style.height = `${lastDir.offsetTop}px`;
        }
    } , [directoryTree]);
    
    return (
        <div>
            {renderDirectoryTree(directoryTree , 1)}
        </div>
    );
}