document.addEventListener('DOMContentLoaded', () => {

        console.log("DOM has loaded");
  
        const add_goal_buttons = document.querySelectorAll('.plus'); // + buttons that add new goals

        const inserted_goals = document.querySelectorAll('.goal'); // each individual goal

        //indent all goals to their corresponding depth
        for (const goal of inserted_goals) {
            const goal_class = goal.className;
            let goal_depth = goal_class.split(' ')[1];
            goal.style.paddingLeft = goal_depth * 2 + "em"
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

        //TODO:
            //upon loading DOM, all goals of Depth > 0 will be made invisible unless revealed
            // - need: all those elements hidden
            //         clicking on parent goal reveals child goals
            //              - name button adds display:block to class when clicked
            //              - when clicked again, anme button removes display block
});
