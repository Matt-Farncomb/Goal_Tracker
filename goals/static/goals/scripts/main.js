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

            for (const item of items) {
                let child = item.className.split(' ')[1];
                let child_id = child.split('_id_')[1];
                console.log("my child is:" + child_id);
                if (child_id == id) {
                    console.log("same")
                    if (item.style.display == "block") {
                        item.style.display = "none";
                    }
                    else {
                        item.style.display = "block";
                    }
                    
                }
            } 
            
            })
        }

        
});


