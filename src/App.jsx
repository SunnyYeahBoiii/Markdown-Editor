import React, { Fragment, useRef, useState, useEffect } from 'react';
import { EditorView, basicSetup } from "codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { bracketMatching, indentOnInput, language } from "@codemirror/language";
import { defaultKeymap } from "@codemirror/commands";
import {keymap} from "@codemirror/view"
import {EditorState ,Prec} from "@codemirror/state"
import { Marked } from "marked";
import hljs from 'highlight.js';
import Prism from 'prismjs';
import { markedHighlight } from "marked-highlight";
import markedKatex from "marked-katex-extension";

const options = {
  nonStandard: true,
  throwOnError: false
};

const marked = new Marked(
  markedHighlight({
	emptyLangClass: 'hljs',
    langPrefix: 'hljs language-',
    highlight(code, lang, info) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      // console.log(lang , language)
      return hljs.highlight(code, { language }).value;
    }
  })
);

marked.setOptions({
  gfm: true,
  breaks: true,
  headerIds: true,
  mangle: false,
});

marked.use(markedKatex(options));

const myTheme = EditorView.theme({
  "&": {
    height: "100%", // Or flex: 1 as shown above
  },
  ".cm-scroller": {
    overflow: "auto",
  }
});

export default function App() {
  const [value, setValue] = useState("");
  const ref = useRef(null);
  const previewRef = useRef(null)
  const textEditorRef = useRef(null)
  const fileInputRef = useRef(null)
  let textEditor , previewArea;
 
  const textRef = useRef(null);

  function wrap(view , marker){
    const {from , to} = view.state.selection.main

    console.log(from , to); 
    view.dispatch({changes:[{from: view.state.selection.main['from'] , insert: marker} , {from: view.state.selection.main['to'] , insert: marker}]})
    return true;
  }

  const toggleBold = (view) => wrap(view , '**');
  const toggleItalic = (view) => wrap(view , '*');

  function shortcut(view){
    return keymap.of([
      {
        key: "Mod-b",
        run(view) {
          toggleBold(view);
          return true;
        }
      },
      {
        key: "Mod-i",
        run(view) {
          toggleItalic(view);
          return true;
        }
      }
    ])
  }

  const lineWrapping = EditorView.lineWrapping;
  
  const state = EditorState.create({
    doc: "```cpp\n#include<bits/stdc++.h>\n```",
    extensions: [
      basicSetup,
      markdown(),
      bracketMatching(),
      indentOnInput(),
      Prec.high(shortcut()),
      myTheme,
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          previewRef.current.innerHTML = marked.parse(update.state.doc.toString());
        }
      })
    ],
  })

  let view;

  useEffect( () => {
    view = new EditorView({
      state,
      parent: document.getElementById("text-editor"),
    });
    previewRef.current.innerHTML = marked.parse(view.state.doc.toString());

    textEditor = document.querySelector(".cm-scroller")
    if(textEditor){
      console.log(textEditor)
      textEditor.addEventListener("scroll" , () => {
        const perc = textEditor.scrollTop / (textEditor.scrollHeight - textEditor.clientHeight)  * 100;
        previewArea.scrollTop = (previewArea.scrollHeight - previewArea.clientHeight) / 100 * perc;
      })
    }
    previewArea = document.getElementById("preview-area");
    if(previewArea){
      previewArea.addEventListener("scroll" , () => {
        const perc = previewArea.scrollTop / (previewArea.scrollHeight - previewArea.clientHeight) * 100;
        textEditor.scrollTop = (textEditor.scrollHeight - textEditor.clientHeight) / 100 * perc;
      })
    }
  } , [])

  return (
    <>
      <div id="split-editor">

        <div id = "editor-area">
            <div  id = "text-editor"></div>
        </div>

        <div id = "preview-area">
            <div ref={previewRef} id = "preview"></div>
        </div>

      </div>

      <div id = "file-area">
         <input ref={fileInputRef} id = "file-input" type='file' accept='.md , .markdown'/>
      </div>
    </>
  );
}
