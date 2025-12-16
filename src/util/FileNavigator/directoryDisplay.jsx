import { Fragment , useEffect, useRef } from "react";
import { DirButton } from "./buttons/DirButton.jsx";
import { FileButton } from "./buttons/FileButton.jsx";

export function DirectoryDisplay({directoryTree , fileRenderer}){
    const renderDirectoryTree = (directoryTree , depth) => {
        if(depth > 1) return (<></>);
        if(directoryTree.length === 0 ) return (<></>);
        console.log(directoryTree)
        if(directoryTree.file?.kind == 'file'){
            return (<div style={{
                marginLeft: `2rem`,
            }} className={depth > 1 ? "dir" : "root"}>
                <FileButton fileRenderer={fileRenderer} file={directoryTree.file} buttonText={directoryTree.name} className={depth > 1 ? "dir-name" : ""} />
            </div> 
           );
        }
        if(directoryTree.childs?.length === 0 ) return (<></>);

        console.log(directoryTree)

        return (
            <div  style={{
            }} className={depth > 1 ? "dir" : "root"}>
                <DirButton fileRenderer={fileRenderer} childList={structuredClone(directoryTree.childs)} className={depth > 1 ? "dir-name" : ""} buttonText={'\\' + directoryTree.name}/>
            </div>
        );
    }
    
    return (
        <>
            {renderDirectoryTree(directoryTree , 1)}
        </>
    );
}