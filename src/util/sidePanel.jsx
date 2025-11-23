import { options } from 'marked';
import { React, useState , useRef } from 'react';

import * as IncrementalDOM from 'incremental-dom'
import MarkdownIt from 'markdown-it'
import MarkdownItIncrementalDOM from 'markdown-it-incremental-dom'
import mk from "@traptitech/markdown-it-katex";
import "katex/dist/katex.min.css";
import markdownItMathjax3 from "markdown-it-mathjax3";
import FileNavigator from './FileNavigator/FileNavigator';

const md = new MarkdownIt({
  html:         true,
  xhtmlOut:     true,
  breaks:       true,
  langPrefix:   'language-',
  linkify:      true,
  typographer:  true,
  quotes: '“”‘’',
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value;
      } catch (__) {}
    }

    return ''; // use external default escaping
  }
}).use(MarkdownItIncrementalDOM, IncrementalDOM)



export function SidePanel({previewRef , textRef, style , closeFunc}){
    const sidePanelRed = useRef(null)

    const renderFile = async (fileHandle) => {
        try{
            console.log("RENDER")
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
                textRef.current.dispatch(trans)
                const func = md.renderToIncrementalDOM(fileContent);
                IncrementalDOM.patch(previewRef.current , func);
                console.log(previewRef)
            }
            
            fr.readAsText(file)
        } catch{
            
        }
    }

    const handleUploadFile = async (e) => {
        e.preventDefault();
        try{
            const [fileHandle] = await window.showOpenFilePicker({types: [
                {
                    description: "Markdown Files",
                    accept: {
                        "text/markdown" : [".md" , ".markdown"]
                    }
                }
                
            ]});
            renderFile(fileHandle);
        } catch{
            console.log("ERROR OCCURED");
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
                <FileNavigator fileRenderer={renderFile}/>
            </aside>
        </>
    );
}