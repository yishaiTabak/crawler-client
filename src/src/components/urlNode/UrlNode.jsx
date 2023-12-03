import React, { useState } from "react";
import "./_urlNode.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

const UrlNode = ({ data, searchTerm }) => {
  const { depth, url, title, children,highlightedContext } = data;

  const [showChildren, setShowChildren] = useState(true)
  
  const boldHighlightedContext =
    <span className="context">
      Highlighted Context:{" "}
      {highlightedContext
        .split(/\b/)
        .map((word, index) =>
          word?.toLowerCase() === searchTerm?.toLowerCase() ? (
            <strong className="bold-word" key={index}>{word}</strong>
          ) : (
            word
          )
        )}
    </span>

    const showAnHideChildren = () =>{
      setShowChildren(!showChildren)
    }

  return (
    <div className="node-container">
      <div className="node-detailes" onClick={showAnHideChildren}>
      <p className="display-text">{`Depth:${depth}, `}<br/><a href={url}>{title}</a>{", "}<br/>{boldHighlightedContext}</p>
      {children && <FontAwesomeIcon icon={faChevronDown} rotation={showChildren? 0: 270} />}
      </div>
      {<div className={showChildren?"children-container": "none"} >
        {children &&
          children.map((child, index) => (
            <UrlNode key={index + url} data={child} searchTerm={searchTerm} />
          ))}
      </div>}
    </div>
  );
};

export default UrlNode;