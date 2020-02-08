document.addEventListener('DOMContentLoaded', () => {

    console.log("DOM has loaded");

    const add_goal_buttons = document.querySelectorAll('.plus'); // + buttons that add new goals

    const items = document.querySelectorAll('.item'); // each individual item

    const title_btns = document.querySelectorAll('.title-btn'); // each individual title_btn

    let goal_arr = []
    let item_arr = []

    //indent all items to their corresponding depth
    for (const item of items) {
        const item_class = item.className;
        let item_depth = parseInt(item_class.split('depth_')[1]);
        item.style.gridColumnStart = item_depth;
        item.style.gridColumnEnd = item_depth+5;

        let item_id = item.id.split(' ')[1];
        item_id = item_id.split('-')[1];
        //console.log(item_id)

       /*  todo 
        ordered by parent id
        1: look at first item and add to array
        2: if item has children iterate through children array
            2a: else, go to next item in array
            2b: if no ore items in array, break
        3: go back to step 1
       */


        ///DONT DELETE!!!!!!!!!!!!
        /* if (item_id === "208") {
            item.style.order = 0;
            item.style.backgroundColor = "red";
        }
        else {
            item.style.order = 1;
        } */
        
        /* id_arr.push(item_id); */

        

        let parent = item.className.split(' ')[1];
        let parentId = parent.split('_id_')[1];

        //item.style.display = "none";
        item_arr.push(item);


        let new_goal = new Goal(item_id, parentId, item)
        goal_arr.push(new_goal) 
    }



    for (let parent of goal_arr) {
         for (child of goal_arr) {
             if (parent.id === child.parentId){
               /*  let node = document.createElement("DIV");
                node.appendChild(parent.htmlElemment);
                document.querySelector(".testy").appendChild(node); */
                //parent.htmlElemment.style.display = "block";
                //child.htmlElemment.style.display = "block";
                //console.log(parent.htmlElemment[0])
                //var node = document.createElement('"' + parent.htmlElemment + '"');                 // Create a <li> node
                var textnode = document.createTextNode("Water");         // Create a text node
                //node.appendChild(textnode);                              // Append the text to <li>
                document.getElementById("testy").node;    // Append <li> to <ul> with id="myList"
             }
         }   
    }

    // add children to to children array of correct parent
    for (parent of goal_arr) {
        for (child of goal_arr) {
            if (parent.id === child.parentId) {
                parent.addChild(child);  
            }
        }
    }

    //flattenedChildren = []
    let flattenedChildren = new Set()

    function flattenChildren(child) {
        flattenedChildren.add(child);
        for (child of child.children) {
            flattenChildren(child);
        }       
    }
  
    for (e of goal_arr) {
        flattenChildren(e)
       
    }
    i = 0;
    for (e of flattenedChildren) {
        e.htmlElemment.style.order = i;
        i++;
    }

    console.log(flattenedChildren)
    

    /*  todo 
        ordered by parent id
        1: look at first item and add to array
        2: if item has children iterate through children array
            2a: else, go to next item in array
            2b: if no ore items in array, break
        3: go back to step 1
       */

    // reveals form to add new goal
    for (const button of add_goal_buttons) {
        button.addEventListener('click', function(event) {  
            const inserted_goal = button.nextElementSibling.nextElementSibling;
            inserted_goal.style.display = "block";
        })  
    }

    //when button is clicked on, hide/show all children
    for (const btn of title_btns) {
        btn.addEventListener('click', function(event) {  
            let id = btn.id.split('_')[1]; 
            let  temp = [];
            for (const parent of goal_arr) {
                if (id === parent.id) {  
                    hideElements(parent.children, parent.closed);
                    parent.closed = !parent.closed;
                }     
            }
        });
    }
});

class Goal {

    id;
    parentId;
    closed;
    children;
    htmlElemment;
    order;

    constructor(id, parentId, item) {
        this.id = id;
        this.parentId = parentId
        this.closed = false; //staus for if all children are hidden or not - true is hidden
        this.children = [];
        this.htmlElemment = item;
        this.order = 0;
    }

    close() {
        this.closed = true;
    }

    open() {
        this.closed = false;
    }

    addChild(newChild) {
        this.children.push(newChild)
    }

    removeChildren(child) {
        //TODO: function to remove child and all its children
    }
}

//recursively hide/show all elements in arr
function hideElements(arr, closed) {
    for (child of arr) {
        if (closed) { // then open
            child.htmlElemment.style.display = "block";    
        }
        else { // then close
            child.htmlElemment.style.display = "none";
        } 
        { //only iterate through children if parent is open because otherwise just leave them closed
        if (child.children.length > 0 && child.closed == false) 
            hideElements(child.children, closed);
        }   
    }
}

/* function arrangeElements(arr) {
    //recursively go through list and all ell elements to another arr
    //then put in order
    let new_arr = []
    for (child of arr) {
        if (child.children.length > 0) {
            new_arr.push(children)
        }
        
    }
} */

// 1: Get all ids from items
// 2: Arrange in order of parent id
// 3: If > 1 items have parent id:
//  3: 1: Arrange by depth, so deeper goes on top

