document.addEventListener('DOMContentLoaded', () => {

        console.log("DOM has loaded");
  
        const add_goal_buttons = document.querySelectorAll('.plus'); // + buttons that add new goals

        const inserted_goals = document.querySelectorAll('.goal'); // each individual goal

        const items = document.querySelectorAll('.item'); // each individual item

        const title_btns = document.querySelectorAll('.title-btn'); // each individual title_btn

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

            console.log("item_depth:" + item_depth);
            /* if (item_depth != 2) {
                item.style.display = "none";
            } */
            
            
        }   

        // reveals form to add new goal
        for (const button of add_goal_buttons) {
            button.addEventListener('click', function(event) {  
                console.log("clicked");
                const inserted_goal = button.nextElementSibling.nextElementSibling;
                inserted_goal.style.display = "block";
                console.log(inserted_goal); 
            })  
        }

        for (const btn of title_btns) {
            btn.addEventListener('click', function(event) {  
            let id = btn.id.split('_')[1]; 
            
            console.log("Clicked id is:" + id);

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
                console.log("my child is:" + child_id);
                id_arr.forEach(e => {
                    if (id == e) {
                        if (item.style.display != "none") {
                            item.style.display = "none"; 
                        }
                        else {
                            console.log("was none")
                            item.style.display = "block";
                        }   
                    }
                });
            }  
        })
    }    
});

//TODO: Function currenlty hides all children
// - BUT if a child of a child is already hidden and then the parents parent is hidden...
// - then th child of the child will be reveealed - because function basically does the opposite of its current state


