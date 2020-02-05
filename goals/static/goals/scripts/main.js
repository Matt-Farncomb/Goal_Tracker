document.addEventListener('DOMContentLoaded', () => {

    console.log("DOM has loaded");

    const add_goal_buttons = document.querySelectorAll('.plus'); // + buttons that add new goals

    const items = document.querySelectorAll('.item'); // each individual item

    const title_btns = document.querySelectorAll('.title-btn'); // each individual title_btn

    let goal_arr = []

    //indent all items to their corresponding depth
    for (const item of items) {
        const item_class = item.className;
        let item_depth = parseInt(item_class.split('depth_')[1]);
        item.style.gridColumnStart = item_depth;
        item.style.gridColumnEnd = item_depth+5;

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

    constructor(id, parentId, item) {
        this.id = id;
        this.parentId = parentId
        this.closed = false; //staus for if all children are hidden or not - true is hidden
        this.children = [];
        this.htmlElemment = item;
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


