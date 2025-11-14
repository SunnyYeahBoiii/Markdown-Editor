import { options } from 'marked';
import { React, useState , useRef } from 'react';

export function SidePanel({textRef, style , closeFunc}){
    const sidePanelRed = useRef(null)

    const handleUploadFile = async (e) => {
        e.preventDefault();
        try{
            console.log(textRef)
            console.log(style)
            console.log(closeFunc)
            const [fileHandle] = await window.showOpenFilePicker({types: [
                {
                    description: "Markdown Files",
                    accept: {
                        "text/markdown" : [".md" , ".markdown"]
                    }
                }
            ]});

            const file = await fileHandle.getFile();

            const fr = new FileReader();

            fr.onload = (e) => {
                const fileContent = e.target.result;
                const trans = textRef.current.state.update({
                    changes: {
                        from: 0,
                        to: textRef.current.state.doc.length,
                        insert: fileContent,
                    }
                })
                console.log(textRef.current.state.doc.length)
                textRef.current.dispatch(trans);
            }

            fr.readAsText(file)
        } catch{
            
        }
    }

    const handleSaveFile = async (e) => {
        e.preventDefault();
        try {
            const fileHandle = await window.showSaveFilePicker({types: [
                {
                    description: "Markdown Files",
                    accept: {
                        "text/markdown" : [".md" , ".markdown"]
                    }
                }
            ]});

            console.log(fileHandle)
            const writable = await fileHandle.createWritable();
            await writable.write(textRef.current.state.doc.toString());
            await writable.close();
        } catch{
            return;
        }
    }

    return (
        <>
            <aside id="side-panel" style={style}>
                <button onClick={closeFunc}>Close Panel</button>
                <button onClick = {handleUploadFile}>Upload File</button>
                <button onClick = {handleSaveFile}>Save File As</button>
            </aside>
        </>
    );
}