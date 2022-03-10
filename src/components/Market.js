import { useEffect, useState } from "react";
import {NODE_START_COL, NODE_START_ROW} from './Pathfind'

Array.prototype.swap = function (x,y) {
    var b = this[x];
    this[x] = this[y];
    this[y] = b;
    return this;
  }
  
  function distance_from_start(col, row){
    return (Math.abs(NODE_START_COL - col) + Math.abs(NODE_START_ROW - row));
  }

  function Product(col,row, name, plat_col, plat_row){
    this.shelf_id = { "x": col, "y": row}
    this.id = `${row}-${col}`
    this.plat_id = {"x":plat_col, "y": plat_row};
    this.name = name;
    this.startD = distance_from_start(plat_col,plat_row);
    this.isPicked = true;
    this.live = false;
    this.path = [];
  }

  const initiateProducts = () =>{
    let tempProducts = new Array();
    let item1 = new Product(17, 18, 'Sensible Portions Sea Salt Garden Veggie Straws - 7oz', 17, 17);
    let item2 = new Product(15, 20, 'Frito-Lay Variety Pack Classic Mix - 18ct', 15, 19);
    let item3 = new Product(10, 26, 'Pampers Sensitive Baby Wipes - 504ct', 10, 27);
    let item4 = new Product(16, 28, 'Pampers Swaddlers Diapers Enormous Pack - Size 2 - 148ct', 16, 27);
    let item5 = new Product(12, 29, 'Silicone Bib with Decal - Cloud Island Dogs/Dots', 12, 30);
    let item6 = new Product(17, 44, 'Clinique High Impact Mascara - Black - 0.28 fl oz - Ulta Beauty', 17, 43);
    let item7 = new Product(16, 48, 'Benefit Cosmetics Precisely, My Brow Pencil Waterproof Eyebrow Definer - Shade 3.7 - Warm Medium Brown - 0.0002oz - Ulta Beauty', 16, 49);

    tempProducts.push(item2);
    tempProducts.push(item1);
    tempProducts.push(item3);
    tempProducts.push(item4);
    tempProducts.push(item5);
    tempProducts.push(item6);
    tempProducts.push(item7);
    
    // tempProducts.push(bead);
    // tempProducts.push(toy);

    let length = tempProducts.length;
    let products = new Array();

    while(tempProducts.length > 0){
    let min = distance_from_start(tempProducts[0].shelf_id.x, tempProducts[0].shelf_id.y);
    let minIndex = 0;
    for(let i=0; i<tempProducts.length; i++){
        let newMin = distance_from_start(tempProducts[i].shelf_id.x, tempProducts[i].shelf_id.y);
        if(newMin < min){
        minIndex = i;
        }
    }
    tempProducts.swap(minIndex, 0);
    products.push(tempProducts.pop());  
    }
    return products;
}

function Market(props){
  const [lists, setLists] = useState([])
  let list = []

    useEffect(() =>{
        let products = initiateProducts();
        props.addProd(products);
        setLists(products)
    }, []);

    return(
      <div>
      <h1><br></br></h1>
      </div>
    )
}

export default Market;
