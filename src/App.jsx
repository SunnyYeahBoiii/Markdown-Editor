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
import {NavBar} from "./navBar.jsx"

import * as IncrementalDOM from 'incremental-dom'
import MarkdownIt from 'markdown-it'
import MarkdownItIncrementalDOM from 'markdown-it-incremental-dom'
import mk from "markdown-it-katex";
import "katex/dist/katex.min.css";

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

export default function App({localFileContent}) {
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

  let timeOutId;

  const debounceUpdate = (update) => {
    if(timeOutId) clearTimeout(timeOutId);

    timeOutId = setTimeout(() => {
      const func = md.renderToIncrementalDOM(update.state.doc.toString());
      IncrementalDOM.patch(previewRef.current , func);
    } , 1);
  }

  const state = EditorState.create({
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
  })

  useEffect( () => {
    console.log(previewRef.current);
    textRef.current = new EditorView({
        state,
        parent: document.getElementById("text-editor"),
    });
    const func = md.renderToIncrementalDOM(localFileContent);
    IncrementalDOM.patch(previewRef.current , func);

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
      <div id ="nav-area">
        <NavBar textRef={textRef}/>
      </div>
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
