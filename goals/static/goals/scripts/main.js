document.addEventListener('DOMContentLoaded', () => {

        console.log("DOM has loaded");
  
        const add_goal_buttons = document.querySelectorAll('.plus'); // + buttons that add new goals

        const inserted_goals = document.querySelectorAll('.goal'); // each individual goal

        //indent the goal to its corresponding depth
        for (const goal of inserted_goals) {
            const indent = goal.className;
            let split_indent = indent.split(' ')[1];
            goal.style.paddingLeft = split_indent * 2 + "em"
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

});
