import React, { Fragment, useRef, useState, useEffect } from 'react';
import { EditorView, basicSetup } from "codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { bracketMatching, indentOnInput, language } from "@codemirror/language";
import { defaultKeymap, indentWithTab } from "@codemirror/commands";
import {keymap} from "@codemirror/view"
import {EditorState ,Prec} from "@codemirror/state"
import { Marked } from "marked";
import hljs from 'highlight.js';
import Prism from 'prismjs';
import { markedHighlight } from "marked-highlight";
import markedKatex from "marked-katex-extension";
import {NavBar} from "./util/navBar.jsx"

import * as IncrementalDOM from 'incremental-dom'
import MarkdownIt from 'markdown-it'
import MarkdownItIncrementalDOM from 'markdown-it-incremental-dom'
import mk from "@traptitech/markdown-it-katex";
import "katex/dist/katex.min.css";
import markdownItMathjax3 from "markdown-it-mathjax3";
import DragLine from './util/dragLine.jsx';

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
}).use(MarkdownItIncrementalDOM, IncrementalDOM).use(mk, {"blockClass": "math-block", "errorColor" : " #cc0000"});


const myTheme = EditorView.theme({
  "&": {
    height: "100%", // Or flex: 1 as shown above
  },
  ".cm-scroller": {
    overflow: "auto",
  }
});

export default function App({localFileContent}) {
  const [value, setValue] = useState("");
  const ref = useRef(null);
  const previewRef = useRef(null)
  const textEditorRef = useRef(null)
  const fileInputRef = useRef(null)
  let textEditor , previewArea;
  const textAreaRef = useRef(null);
  const previewAreaRef = useRef(null);
 
  const textRef = useRef(null);

  function wrap(view , marker){
    const {from , to} = view.state.selection.main

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

  let timeOutId;

  const debounceUpdate = (update) => {
    if(timeOutId) clearTimeout(timeOutId);

    timeOutId = setTimeout(() => {
      console.log('rerender');
      const func = md.renderToIncrementalDOM(update.state.doc.toString());
      IncrementalDOM.patch(previewRef.current , func);
      localStorage.setItem('markdown' , textRef.current.state.doc.toString());
    } , 300);
  }

  const [state] = useState(EditorState.create({
    doc: localFileContent,
    extensions: [
      basicSetup,
      markdown(),
      bracketMatching(),
      keymap.of([indentWithTab]),
      indentOnInput(),
      Prec.high(shortcut()),
      myTheme,
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          debounceUpdate(update);
        }
      })
    ],
  }))

  useEffect( () => {
    textRef.current = new EditorView({
        state,
        parent: document.getElementById("text-editor"),
    });
    const func = md.renderToIncrementalDOM(localFileContent);
    IncrementalDOM.patch(previewRef.current , func);

    textEditor = document.querySelector(".cm-scroller")
    if(textEditor){
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
      <div id ="nav-area">
        <NavBar previewRef={previewRef} textRef={textRef}/>
      </div>
      <div id="split-editor">

        <div ref={textAreaRef} id = "editor-area">
            <div id = "text-editor"></div>
        </div>

        <DragLine previewRef={previewAreaRef} textRef={textAreaRef}/>

        <div ref={previewAreaRef} id = "preview-area">
            <div ref={previewRef} id = "preview"></div>
        </div>

      </div>
    </>
  );
}
