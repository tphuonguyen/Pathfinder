import React, {useState, useEffect} from "react";
import Node from  "./Node"
import "./Pathfind.css"
import Astar from "../astarAlgorithm/astar.js"

const cols = 56;
const rows = 50;

const NODE_START_ROW = 49;
const NODE_START_COL = 45;
const NODE_END_ROW = 26;
const NODE_END_COL = 46;

const Pathfind = (props) =>{
    const [Grid, setGrid] = useState([]);
    let [Path, setPath] = useState([]);
    const [Products, setProducts] = useState(props.products);
    const [Goal, setGoal] = useState(null);

    let products = new Array();
    
    useEffect(() => {
        products = props.products; 
        products = insertionSort(products);
        initializeGrid(products);
        setProducts(products);
        
    },[props]);

    const initializeGrid = (main_products) =>{
        const grid = new Array(rows);
        for(let i = 0; i < rows; i++){
            grid[i] = new Array(cols);
        }

        createSpot(grid);
        setGrid(grid);
        addNeighbors(grid);  
        addLabels(grid);  
        setGoal(grid[49][45]);      

        let parent_path = [];
        let startNode = grid[NODE_START_ROW][NODE_START_COL];
        startNode.plat = startNode;


        //products = insertionSort(main_products);
        products = main_products;

        let checkout = grid[26][46];
        for(let i=0; i<products.length; i++){
            if(products[i].isPicked){
                let gridelement = grid[products[i].shelf_id.x][products[i].shelf_id.y];
                gridelement.isEnd = true;
                gridelement.isWall = true;
                gridelement.isPath= false;
                gridelement.title = products[i].name;
                gridelement.isPickupTile = true;
                gridelement.plat = grid[products[i].plat_id.x][products[i].plat_id.y];
                document.getElementById(`node-${products[i].shelf_id.y}-${products[i].shelf_id.x}`).style.background = 'red';
                let endNode = gridelement;
                let path = Astar(startNode.plat, endNode.plat);
                products[i].startD=path.length;
                for(let i=0; i<path.length; i++){
                    parent_path.push(path[i]);
                }
                cleanSpots(grid)
                startNode = endNode;
                }
        }
        let path = Astar(startNode, checkout);
        for(let i=0; i<path.length; i++){
            parent_path.push(path[i]);
        }
        setPath(parent_path); 
        return parent_path;
    };

    function insertionSort(arr){
        for(let i = 1; i < arr.length;i++){
            for(let j = i - 1; j > -1; j--){
                if(arr[j + 1].startD < arr[j].startD){
                    [arr[j+1],arr[j]] = [arr[j],arr[j + 1]];
                }
            }
        };
      return arr;
    }
        
    const cleanSpots = (grid) =>{
        for (let r= 0; r < rows; r++){
            for(let c=0; c<cols; c++){
                let val = grid[r][c];
                val.g = 0;
                val.f = 0;
                val.h = 0;
                val.previous = undefined;
            }
        }
    }

    const createSpot = (grid) =>{
        for(let i=0; i< rows; i++){
            for(let j=0; j < cols; j++){
                grid[i][j] = new Spot(i, j)
            }
        }
    }

    const gridwithNode = (
        <div>
            {Grid.map((row, rowIndex) => {
                return (
                    <div key={rowIndex} className="rowWrapper">
                        {row.map((col, colIndex) => {
                            const {isStart, isEnd, isWall, isAisle, isPath, title, isPickupTile} = col;
                            if(isPickupTile){
                                return(
                                <div onClick = {(e) => assignGoal2(e)}>
                                <Node key={colIndex} isStart={isStart} isAisle={isAisle} isPath={isPath} isEnd={isEnd} row={rowIndex} col={colIndex} isWall={isWall} title={title} isPickupTile={isPickupTile}/>
                                </div>
                            )
                            }
                            return(
                                <div>
                                <Node key={colIndex} isStart={isStart} isAisle={isAisle} isPath={isPath} isEnd={isEnd} row={rowIndex} col={colIndex} isWall={isWall} title={title} isPickupTile={isPickupTile}/>
                                </div>
                            )
                        })}
                    </div>
                )
            })}
        </div>
    );

   

    const visualizePath = () => {
        Path = [];
        Path = initializeGrid(Products);
        
        for(let i=0; i<Path.length; i++){
            const node = Path[i];
            document.getElementById(`node-${node.x}-${node.y}`).className = 'node node-shortest-path'
            
            
        }
        console.log("Visualizing")
    }


    const assignGoal2 = (product) =>{
        let id = product.target.id.substring(5);
        let index = 0;
        for(let i = 0; i<id.length; i++){
            if(id[i] === '-'){
                index = i;
                break;
            }
        }
        let col = id.substring(0, index);
        let row = id.substring(index+1);
        console.log(col);
        console.log(row);
        console.log(Goal);
        index = 0;
        for(let i = 0; i<Products.length; i++){
            if(Products[i].id === id){
                index = i;
                
                break;
            }
        }

        let node = Products[index];
        
        if(node.live){
            for(let i=0; i<node.path.length; i++){
                const nodeval = node.path[i];
                let color = '#E4E8EC'
                if(nodeval.isPickupTile){
                    color = 'red'
                }else if(nodeval.isStart){
                    color = 'rgb(0, 255, 0)'
                }
                document.getElementById(`node-${nodeval.x}-${nodeval.y}`).style.backgroundColor = color;
            }
            node.live = false;
            node.isEnd = false;
            node.isWall = true;
            node.isPath= false;
            node.title = Products[index].name;
            node.isPickupTile = false;
            setGoal(node.path[node.path.length-1])
        }else{
            alert(node.name);
            node.live = true;
            node.isEnd = true;
            node.isWall = false;
            node.isPath= true;
            node.title = Products[index].name;
            node.isPickupTile = true;
            node.plat = Grid[Products[index].plat_id.x][Products[index].plat_id.y];
            let path = Astar(Goal, node.plat);
            cleanSpots(Grid)
            setGrid(Grid);
            setGoal(Grid[row][col].plat);
            node.path = path;
            for(let i=0; i<node.path.length; i++){
                const nodeval = path[i];
                let color = 'rgb(255, 143, 143)'
                if(nodeval.isPickupTile){
                    color = 'red'
                }else if(nodeval.isStart){
                    color = 'rgb(0, 255, 0)'
                }
                document.getElementById(`node-${nodeval.x}-${nodeval.y}`).style.backgroundColor = color
            }
        }
        console.log(node.path)
    }

    const assignGoal = (product) =>{
        let id = product.target.id;
        let index = 0;
        for(let i = 0; i<id.length; i++){
            if(id[i] === '-'){
                index = i;
                break;
            }
        }
        let col = id.substring(0, index);
        let row = id.substring(index+1);
        console.log(col);
        console.log(row);
        console.log(Goal);
        index = 0;
        for(let i = 0; i<Products.length; i++){
            if(Products[i].id === id){
                index = i;
                break;
            }
        }
        let node = Products[index];
        let val = []
        for(let i =0; i<Products.length; i++){
            if(i == index){
                node.isPicked = !node.isPicked;
                node.isEnd = !node.isEnd;
                node.isWall = true;
                node.isPath= !node.isPath;
                node.title = Products[index].name;
                node.isPickupTile = !node.isPickupTile;
                document.getElementById(`node-${col}-${row}`).style.backgroundColor = !node.isPicked? '#FFFFFF' : 'red'
                console.log(document.getElementById(id));
                
            }
                
            
        }
        //setProducts(val);
        
    }

    const list = Products.map(product => <li className="list"><label className="switch"> <input type="checkbox"></input>
    <span className = "slider round" id = {`${product.shelf_id.y}-${product.shelf_id.x}`} onClick={(product) => assignGoal(product)}></span>
    </label>{product.name}</li>) ;

    const checkout = () =>{
        let path = Astar(Goal, Grid[NODE_END_ROW][NODE_END_COL]);
        for(let i = 0; i<path.length; i++){
            let nodeval = path[i];
            document.getElementById(`node-${nodeval.x}-${nodeval.y}`).style.backgroundColor = 'rgb(255, 143, 143)'
        }
    }

    return(
        <div className="Wrapper">
        <button className = "customButton" onClick={visualizePath}>Generate Fastest Route</button>
            {gridwithNode}
            <div >  
            <p><b>Remove/Add Items From Your Cart</b></p>
            {list}
            </div>
            <button className = "checkoutButton" onClick = {checkout} >CheckOut</button>
        </div>
        );
};

const addNeighbors = (grid) => {
    for(let i=0; i< rows; i++){
        for (let j=0; j< cols; j++){
            grid[i][j].addneighbors(grid);
        }
    }
}

const addLabels = (grid) => {
    grid[12][9].title = "Snacks";
    grid[13][25].title = "Baby";
    grid[11][44].title = "Beauty";
    grid[3][39].title = "Pharmacy";
    grid[19][4].title = "Wine And Spirits";
    grid[26][8].title = "Grocery";
    grid[24][19].title = "Boys";
    grid[27][23].title = "Fitting Rooms";
    grid[32][20].title = "Mens";
    grid[21][43].title = "Order Pickup";
    grid[27][44].title = "Checkout";
    grid[36][7].title = "Tech";
    grid[44][5].title = "Toys/Games";
    grid[39][32].title = "Entertainment";
    grid[42][27].title = "Seasonal";
    grid[45][37].title = "Entrance";
}

function getWall(x, y){
    let isWall = false;
    let pickupTile = null;
    if (y >= 0 && y <= 35 && x >= 0 && x <= 6){
        isWall = true;
    }
    if (y >= 0 && y <= 12 && x >= 7 && x <= 9){
        isWall = true;
    }
    if (y >= 0 && y <= 2 && x >= 29 && x <= 49){
        isWall = true;
    }
    if (y >= 48 && y <= 55 && x >= 32 && x <= 49){
        isWall = true;
    }
    if (y >= 39 && y <= 55 && x >= 0 && x <= 1){
        isWall = true;
    }
    if (y >= 54 && y <= 55 && x >= 0 && x <= 32){
        isWall = true;
    }
    if (y >= 51 && y <= 55 && x >= 0 && x <= 7){
        isWall = true;
    }
    return isWall;
}

function getAisles(x, y){
    let isAisle = false;
    let pickupTile = null;
    // horizontal blocks, squares, and dots
    if ((y >= 2 && y <= 4 && x == 10) || (y >= 7 && y <= 13 && x == 10) || (y >= 15 && y <= 18 && x == 7) || (y >= 20 && y <= 24 && x == 7) || 
    (y >= 26 && y <= 29 && x == 7) || (y >= 33 && y <= 35 && x == 7) || (y >= 47 && y <= 50 && x == 7) || (y >= 4 && y <= 16 && x >= 12 && x <= 13) ||
    (y >= 4 && y <= 14 && x >= 15 && x <= 16) || (y >= 4 && y <= 7 && x >= 19 && x <= 21) || (y >= 11 && y <= 14 && x >= 19 && x <= 21) || (y == 10 && x == 20) ||
    (y >= 4 && y <= 14 && x >= 23 && x <= 25) || (y >= 5 && y <= 14 && x >= 28 && x <= 29) || (y >= 5 && y <= 14 && x == 31) || (y >= 5 && y <= 14 && x >= 33 && x <= 34) ||
    (y >= 5 && y <= 11 && x == 36) || (y >= 5 && y <= 11 && x == 38) || (y >= 5 && y <= 14 && x == 41) || (y >= 5 && y <= 14 && x >= 43 && x <= 44) || (y >= 5 && y <= 14 && x == 46) ||
    (y >= 51 && y <= 53 && x == 8) || (y >= 18 && y <= 21 && x >= 21 && x <= 22) || (y >= 35 && y <= 36 && x >= 21 && x <= 22) || (y >= 38 && y <= 39 && x >= 21 && x <= 22) ||
    (y == 18 && x == 24) || (y == 18 && x == 30) || (y == 39 && x == 28) || (y == 29 && x == 36) || (y >= 4 && y <= 38 && x == 48) || (y >= 45 && y <= 46 && x == 31) ||
    (y >= 33 && y <= 35 && x == 28) || (y >= 20 && y <= 25 && x == 28) || (y >= 22 && y <= 24 && x == 31) || (y >= 22 && y <= 24 && x == 33) || (y >= 36 && y <= 38 && x == 32)){
        isAisle = true;
    }
    //vertical blocks
    if((y == 1 && x >= 11 && x <= 21) || (y == 1 && x >= 23 && x <= 25) || (y == 1 && x >= 27 && x <= 28) || (y == 13 && x >= 7 && x <= 10) || (y == 18 && x >= 9 && x <= 18) ||
    (y == 20 && x >= 9 && x <= 18) || (y == 23 && x >= 9 && x <= 18) || (y >= 25 && y <= 26 && x >= 10 && x <= 18) || (y >= 28 && y <= 29 && x >= 10 && x <= 18) || 
    (y == 32 && x >= 9 && x <= 18) || (y >= 34 && y <= 35 && x >= 10 && x <= 18) || (y == 37 && x >= 9 && x <= 18) || (y >= 39 && y <= 40 && x >= 9 && x <= 18) ||
    (y == 42 && x >= 9 && x <= 18) || (y >= 44 && y <= 45 && x >= 9 && x <= 17) || (y >= 47 && y <= 48 && x >= 9 && x <= 13) || (y >= 47 && y <= 48 && x >= 15 && x <= 17) ||
    (y == 50 && x >= 11 && x <= 17) || (y == 53 && x >= 9 && x <= 12) || (y == 53 && x >= 14 && x <= 17) || (y == 51 && x >= 25 && x <= 28) || (y == 47 && x >= 23 && x <= 28) ||
    (y == 44 && x >= 27 && x <= 30) || (y == 47 && x >= 32 && x <= 48) || (y == 3 && x >= 29 && x <= 47) || (y == 24 && x >= 24 && x <= 26) || (y == 31 && x >= 24 && x <= 26) ||
    (y == 33 && x >= 23 && x <= 24) || (y == 36 && x >= 27 && x <= 29) || (y == 35 && x >= 33 && x <= 35) || (y >= 38 && y <= 39 && x >= 35 && x <= 36) ||
    (y >= 18 && y <= 19 && x >= 35 && x <= 36) || (y == 14 && x >= 36 && x <= 38) || (y >= 17 && y <= 18 && x >= 39 && x <= 46) || (y == 20 && x >= 39 && x <= 46) ||
    (y >= 22 && y <= 23 && x >= 39 && x <= 46) || (y >= 25 && y <= 26 && x >= 39 && x <= 46) || (y == 28 && x >= 39 && x <= 41) || (y == 28 && x >= 43 && x <= 46) ||
    (y >= 30 && y <= 31 && x >= 39 && x <= 46) || (y == 33 && x >= 39 && x <= 46) || (y >= 35 && y <= 36 && x >= 39 && x <= 46) || (y == 38 && x >= 39 && x <= 44) ||
    (y >= 43 && y <= 45 && x >= 33 && x <= 47)){
        isAisle = true;
    }
    return isAisle;
}

function getPath(x, y){
    let isPath = false;
    let pickupTile = null;
    if (!getWall(x, y) && !getAisles(x, y)){
        isPath = true;
    }
    return isPath;
}

function getFittingRoom(x, y){
    let isRoom = false;
    let pickupTile = null;
    if (x == 39 && y == 42){
        isRoom = true;
    }
    return isRoom;
}


function Spot(i, j){
    this.y = i;
    this.x = j;
    this.isStart = this.y === NODE_START_ROW  && this.x === NODE_START_COL;
    this.isEnd = false;
    this.g = 0;
    this.f = 0;
    this.h = 0;
    this.title = null;
    this.neighbors = [];
    this.isWall = getWall(i, j);
    this.isAisle = getAisles(i, j);
    this.isPath = getPath(i, j);
    this.isFittingRoom = getFittingRoom(i, j);
    this.previous = undefined;
    this.isPickupTile = undefined;
    this.plat = undefined;
    this.addneighbors = function(grid){
        let i = this.y;
        let j = this.x;
        if(i > 0) this.neighbors.push(grid[i-1][j])
        if(i < rows - 1) this.neighbors.push(grid[i+1][j])
        if(j > 0) this.neighbors.push(grid[i][j-1]);
        if(j < cols - 1) this.neighbors.push(grid[i][j+1]);
    };
}

export {Pathfind, NODE_START_COL, NODE_START_ROW};
