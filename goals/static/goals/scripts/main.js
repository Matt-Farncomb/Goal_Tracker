document.addEventListener('DOMContentLoaded', () => {

        console.log("DOM has loaded");
  
        const add_goal_buttons = document.querySelectorAll('.plus'); // + buttons that add new goals

        const inserted_goals = document.querySelectorAll('.goal'); // each individual goal

        const items = document.querySelectorAll('.item'); // each individual item

        const title_btns = document.querySelectorAll('.title-btn'); // each individual title_btn

        let goal_arr = []

        //indent all goals to their corresponding depth
        for (const goal of inserted_goals) {
            const goal_class = goal.className;
            let goal_depth = goal_class.split(' ')[1];
            goal.style.paddingLeft = goal_depth * 2 + "em"
        }   

         //indent all items to their corresponding depth
         for (const item of items) {
            const item_class = item.className;
            let item_depth = parseInt(item_class.split('depth_')[1]);
            item.style.gridColumnStart = item_depth;
            item.style.gridColumnEnd = item_depth+5;

            let item_id = item.id.split(' ')[1];
            item_id = item_id.split('-')[1];
            //console.log("id:" + item_id);

            let parent = item.className.split(' ')[1];
            let parentId = parent.split('_id_')[1];
            //console.log("parent_id:" + parentId);

            /* if (item_depth != 2) {
                item.style.display = "none";
            } */

            let new_goal = new Goal(item_id, parentId, item)
            goal_arr.push(new_goal) 
 
            //console.log(new_goal.htmlElemment)
        }
        for (parent of goal_arr) {
            for (child of goal_arr) {
                if (parent.id === child.parentId) {
                    parent.addChild(child);
                    
                }
            }
            // prints out contents of goal class array
            //console.log("Children of " + parent.id + " are: ");
                    for (child of parent.children) {
                        //console.log(child.id);
                    } 
        }

        // reveals form to add new goal
        for (const button of add_goal_buttons) {
            button.addEventListener('click', function(event) {  
                console.log("clicked");
                const inserted_goal = button.nextElementSibling.nextElementSibling;
                inserted_goal.style.display = "block";
                //console.log(inserted_goal); 
            })  
        }

        /* for (const btn of title_btns) {
            btn.addEventListener('click', function(event) {  
            let id = btn.id.split('_')[1]; 
            
            console.log("Clicked id is:" + id);
            let closing = false;

            //show all things that have the parent id matching this id
            id_arr = [];
            for (const item of items) {
                let child = item.className.split(' ')[1];
                let child_id = child.split('_id_')[1];
                
                // adds the id of the element that will be hidden
                // - it will then hide all elements that have this id as its parent
                // - which will recursively hude all children of the original hidden element
                if (!id_arr.includes(child_id)) {
                    id_arr.push(child_id);
                    console.log(id_arr);
                 }

                 if (item.style.display != "none") {
                    closing = true;
                    console.log("true");
                 }
                 
                console.log("my child is:" + child_id);
                id_arr.forEach(e => {
                    if (id == e) {
                        if (closing) {
                            item.style.display = "none";
                        }
                        else {
                            item.style.display = "block";
                        }   
                    }
                });
            }  
        })
    } */
    
    for (const btn of title_btns) {
        btn.addEventListener('click', function(event) {  
        let id = btn.id.split('_')[1]; 
        let  temp = [];
        for (const parent of goal_arr) {
            //console.log(parent);
            if (id === parent.id) {  
                console.log(parent.closed);
                //parent.htmlElemment.style.display = "none";
                hideElements(parent.children, parent.closed);
                parent.closed = !parent.closed;
                console.log(parent.closed);
                
                /* for (child of parent.children) {
                    console.log("Children are:" + child.id);
                    child.htmlElemment.style.display = "none";
               } */
            }
            
        }
        
       
        let closing = false;

        });
    }
});

//TODO: Function currenlty hides all children
// - BUT if a child of a child is already hidden and then the parents parent is hidden...
// - then th child of the child will be reveealed - because function basically does the opposite of its current state

// - THe above error will be attempted to resolve with the class below - IN PROGRESS
// Each goal will be a class
// Each class will have an opened or close status
// When it is closed individually, status is set to closed
// When its parent is closed, all children will be closed by js and css only
// The class will remain as open
// This is so when the parent is reopened, then any previously oepened children can be reopened automatically
/// This might be terrible and not wok, but havne timplemented it yet
// Could even have a seperate fields of "was closed" and "is closed"

    class Goal {

        id;
        parentId;
        closed;
        children;

        constructor(id, parentId, item) {
            this.id = id;
            this.parentId = parentId
            this.closed = false; //staus for if all children are hidden or not - true is hidden
            this.children = []
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
            //function to remove child
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
            if (child.children.length > 0) {
                hideElements(child.children, closed);
            }   
       }
    }


