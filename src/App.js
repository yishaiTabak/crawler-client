import React, { useEffect, useRef, useState } from "react";
import Search from "./src/components/search/Search";
import UrlNode from "./src/components/urlNode/UrlNode";

function App() {
  const [socket, setSocket] = useState(null);
  const [searchTerm, setSearchTerm] = useState("")
  const resultsRef = useRef(null)
  const [renderer, setRenderer] = useState(null)
  const [loading, setLoading] = useState(false)
  const [errorMessage,setErrorMessage] = useState("")

  useEffect(() => {
    const newSocket = new WebSocket(process.env.REACT_APP_URL_SERVER);

    newSocket.addEventListener('open', () => {
      console.log('WebSocket connection established');
      setSocket(newSocket)
    });

    newSocket.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      onMessage(data)
    })

    return () => {
      newSocket.close();
    };
  }, []);

  const onMessage = (data) =>{
    if(data ==="not found")
    setErrorMessage("sorry, not found")
  else if(data === "url error")
    setErrorMessage("url does not exist")
  else if(data === "finished"){
    setLoading(false)
  }else
    addNode(resultsRef.current, data)
  }

    const addNode = (parent, newNode) => {
    if(newNode.parentUrl == null){
      resultsRef.current = newNode
      setRenderer({...resultsRef.current})

    } else if (parent?.url === newNode.parentUrl) {
      if(!parent.children){
        parent.children = []
      }
      
      parent.children.push(newNode);
      setRenderer({...resultsRef.current})

    } else if(parent?.children) {
      parent.children.forEach((child) => addNode(child, newNode));
    }
  };

  return (
    <div className="App">
      {socket && <Search socket={socket} setSearchTerm={setSearchTerm} setLoading={setLoading} loading={loading} errorMessage={errorMessage} setErrorMessage={setErrorMessage} />}
      <h1 className="results-title">results:</h1>
      {resultsRef.current? <UrlNode  data={resultsRef.current} searchTerm={searchTerm} />:
      <div className="start-search">there is no results yet, start in your search..</div>}
    </div>
  );
}

export default App;