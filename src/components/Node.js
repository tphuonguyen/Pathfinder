import React from "react"
import "./Node.css"
import {Pathfind} from './Pathfind'

const Node = ({isStart, isEnd, row, col, isWall, isAisle, isPath, title, isPickupTile }) =>{
    const classes = isStart ? "node-start" : isWall? "iswall": isAisle? "isaisle": isPath? "ispath" : isEnd ? "node-end": "";
    const name = title ? title: "";

    const getDetails = (e) =>{
        alert(title);
    }

    if(isPickupTile){

        return (
        <div className={`node ${classes}`} id={`node-${col}-${row}`}><span className="title"></span></div>
        );
    }

    return(
        <div className={`node ${classes}`} id={`node-${col}-${row}`}><span className="title">{name}</span></div>
    );


}




export default Node;
