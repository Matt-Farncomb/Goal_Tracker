document.addEventListener('DOMContentLoaded', () => {

    console.log("DOM has loaded");

    const add_goal_buttons = document.querySelectorAll('.plus'); // + buttons that add new goals
    const items = document.querySelectorAll('.item'); // each individual item
    const title_btns = document.querySelectorAll('.title-btn'); // each individual title_btn
    let goal_arr = [];
    //let flattenedChildren = new Set();
    //let child_order = 0; //used to set the css grid order of children when they are flattened

    console.log(typeof data);
    console.log(data);
    
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

    //store each individual file in a set, eliminating any duplciates
    //1: Adds child to ser
    //2: Looks in childs children array
    //3: If the child from the children array is not in set:
    //3a: Change its order value
    //3b: Call the flatten function and go back to step 1, inserting this child into function
    function flattenChildren(child) {
        flattenedChildren.add(child);
        for (child of child.children) {
            if (!flattenedChildren.has(child)){
                //change order of child
                child.htmlElemment.style.order = child_order;
                child_order++;
                flattenChildren(child);         
            }    
        }       
    }

    //recursively hide/show all elements in arr
    function hideElements(arr, closed) {
        for (child of arr) {

            if (closed) { // then open
                child.htmlElemment.style.display = "block";    
            } else { // then close
                child.htmlElemment.style.display = "none";
            } 
            
            //only iterate through children if parent is open because otherwise just leave them closed
            if (child.children.length > 0 && child.closed == false) { 
                hideElements(child.children, closed);
            }   
        }
    }

    let row_number = 1;

    //indent all items to their corresponding depth
    for (const item of items) {
        
        const item_class = item.className;
        let item_depth = parseInt(item_class.split('depth_')[1]);
        item.style.gridColumnStart = item_depth;
        item.style.gridColumnEnd = item_depth+5; 
        
            /* TODO:
                - The buttons need to be a sperate item from the title
                - This is so they can resice independantly
                - The buttons always stay the same
                - The text box for title changes according to its content
            */


        item.style.gridRowStart = row_number;
        let bob = getComputedStyle(item);
        console.log(bob.gridRowStart)
        console.log(row_number)
        row_number++;

        let item_id = item.id.split(' ')[1];
        item_id = item_id.split('-')[1];
 
        let parent = item.className.split(' ')[1];
        let parentId = parent.split('_id_')[1];

        let new_goal = new Goal(item_id, parentId, item)
        goal_arr.push(new_goal) 
    }

    // add children to to children array of correct parent
    for (parent of goal_arr) {
        for (child of goal_arr) {
            if (parent.id === child.parentId) {
                parent.addChild(child);  
            }
        }
    }
  
    //now that children are assigned to correct parent, add them to the set with flattenedChildren

    /* for (e of goal_arr) {
        flattenChildren(e);  
    } */

    // reveals form to add new goal
    for (const button of add_goal_buttons) {
        button.addEventListener('click', function(event) {  
            const inserted_goal = button.nextElementSibling.nextElementSibling;
            console.log(inserted_goal)
            inserted_goal.style.display = "block";
        })  
    }

    //when button is clicked on, hide/show all children
    for (const btn of title_btns) {
        btn.addEventListener('click', function(event) {  
            let id = btn.id.split('_')[1]; 
            for (const parent of goal_arr) {
                if (id === parent.id) {  
                    hideElements(parent.children, parent.closed);
                    parent.closed = !parent.closed;
                }     
            }
        });
    }
});