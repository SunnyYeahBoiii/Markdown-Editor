import {useState} from 'react'
import {DirectoryDisplay} from "./directoryDisplay.jsx"

function FileNavigator(){
    const [directoryTree , setDirectoryTree] = useState([]);
    
    async function DFS(dir){
          if(dir.kind == 'file'){
              return {
                  name: dir.name,
                  childs: [],
              }
          }
          
          let childs = [];

          for await (const entry of dir.values()) {
            if(entry.kind == 'file'){
                childs.push({
                    file: entry,
                    name: entry.name,
                    childs: [],
                })
                continue;
            }
            const subDir = await dir.getDirectoryHandle(entry.name, {
                create: true,
            });
            childs.push(await DFS(subDir));
        }
        return {
            name: dir.name,
            childs: childs,
        }
    }

    const handleOpenDirectory = async () => {
        const directory = await window.showDirectoryPicker();
        const obj = await DFS(directory);
        setDirectoryTree(obj);
    }

    return (
        <>
            <button onClick={handleOpenDirectory}>Open Directory</button>
            <DirectoryDisplay directoryTree={directoryTree} />
        </>
    );
}

export default FileNavigator;