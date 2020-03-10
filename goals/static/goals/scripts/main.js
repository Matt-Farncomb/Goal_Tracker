document.addEventListener('DOMContentLoaded', () => {

    console.log("DOM has loaded");
    console.log(typeof data);
    console.log(data);

    
    let goal_arr = [];
    let form_children = document.querySelector("#new-goal-form").children;

    // add arg[0] to elements of arg[1]
    addClickEvent(disable, '.tick');
    addClickEvent(revealGoalForm, '.plus', form_children);
    addClickEvent(showHideChildren, '.title-btn', goal_arr);
    // organise DOM by indenting items to the right depth and adding indented items to their parent list
    organiseDOM(goal_arr);  

    applyCorrectFormValues(form_children);

    determineInputPosition();
    


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

// make sure teh created goal has the values of the correct parent
// eg - the goal it was created under or the main page
function applyCorrectFormValues(form_children) {
    
    goalFocusDict = { "inputBox": form_children[4] , "submitButton": form_children[5] }

    /* goalFocusList = [form_children[3], form_children[4]]; */
    document.addEventListener('click', function(event) {
        checkFocus(goalFocusDict, resetFormValues)
        console.log("clicking");
    })
}

// when any 'element' is clicked on, perform 'func'
function addClickEvent(func, element, list) {
    document.querySelectorAll(element).forEach(
        ele => ele.addEventListener('click', function(event) {
           func(ele, list);
    })
)}

// reset values of form to refer to the 0'th level
function resetFormValues(element) {
    console.log("I am", element);
    console.log("element.children[2].value: " + element.children[2].value);
    console.log("element.children[3].value " + element.children[3].value);
    
    element.children[2].value = "None"; //  parent_id_input
    element.children[3].value = 0; //  depth_id_input
    console.log("reset");
}

function checkFocus(elementToCheck, func){
    console.log("active: ", document.activeElement);
    console.log("elementToCheck: ", elementToCheck.inputBox);
    /* if (!elementToCheck.includes(document.activeElement)) {
        func(elementToCheck.inputBox.parentElement);
    } */
    console.log("elementToCheck", elementToCheck)
    if (!document.activeElement in elementToCheck) {
        
        func(elementToCheck.inputBox.parentElement); 
        
    }
    console.log("gdfdfgfgg");
}

// when item has been 'ticked', make it appear disabled, hide the tick and reveal the delete button
function disable(element) {
    if (element.classList.contains("disabled")) {
    }
    else {
        
        /* element.parentElement.parentElement.style.opacity = "20%"; */
        // Make text content and add button greyed out
        //element needs to be tick form for this to work
        element.nextElementSibling.nextElementSibling.style.opacity = "20%";
        element.nextElementSibling.nextElementSibling.disabled = true;
        element.parentElement.previousElementSibling.style.opacity = "20%";

        //hide tick and reveal cross
        element.hidden = true;
        element.nextElementSibling.hidden = false;
        /* element.children[2].children[0].value = "True";
        console.log(element.children[2].children[0]); */
    } 
}

function revealGoalForm(button, form_children) {
    const inserted_goal = button.nextElementSibling;

    //TODO: No longer actually 'reveal form'
    // - Cursor will go jump into that text box
    // - escaping out of text-box will cause box to revert back to normal no parent value

    //get id
    let parent = button.parentElement.parentElement.parentElement;
    let parent_id = parent.id.split(' ')[1]; 
    parent_id = parent_id.split('-')[1];
    /* console.log("p_id: " + parent_id); */

    //get depth id
    const item_class = parent.className;
    let depth_id = parseInt(item_class.split('depth_')[1]);
    /* console.log("depth_id: " + depth_id); */

    //get form
    // - change form id and depth to necessary values
    /* form = document.querySelector("#new-goal-form"); */

    for (const child of form_children) {
        if (child.name == "parent") {
            child.setAttribute("value", parent_id);
        }
        else if (child.name == "depth_id") {
            child.setAttribute("value", depth_id);
        }
        else if (child.name == "new_goal"){
            child.focus();
            
        }
    }
/*     console.log(form.children[3]);
    console.log(form.children[2]); */

    //jump cursor into text box
}

//when button is clicked on, hide/show all children
function showHideChildren(button, list) {
    let id = button.id.split('_')[1]; 
    for (const parent of list) {
        if (id === parent.id) {  
            hideElements(parent.children, parent.closed);
            parent.closed = !parent.closed;
        }     
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

// position goal items on the DOM according to their depth
function alignItem(item, row_number) {
    // retrieve required item depth
    const item_class = item.className;
    let item_depth = parseInt(item_class.split('depth_')[1]);
    // align item according to its depth
    item.style.gridColumnStart = item_depth;
    item.style.gridColumnEnd = item_depth+5; 
    item.style.gridRowStart = row_number.value;
    /* item.classList.add("row-" + row_number.value) */
    row_number.value++;
    if (row_number.value >= 10) {
        /* peakRows = true; */

    }
    
    /* return row_number; */
}

function checkIfCompleted(item) {
    const classList = item.classList;
    let completed = classList[classList.length-1];
    let completed_status = completed.split('_')[1];
    if (completed_status == "True") {
        // disable fuction starts at tick form, so must bring item to that depth in html tree
        disable(item.children[0].children[1].children[0]);
        /* console.log(item.children[0].children[1].children[0]); */
    }
}   

// build up a list of goals and their children
// the list is used to know which child belongs to which parent
// ... so that when one is closed, it will close the children in the tree
function buildGoalList(item, list) {
    // get data for goal object 
    // get item id
    let item_id = item.id.split(' ')[1];
    item_id = item_id.split('-')[1];
    // get parent id
    let parent = item.className.split(' ')[1];
    let parentId = parent.split('_id_')[1];
    // create object and add to goal list
    let new_goal = new Goal(item_id, parentId, item)
    list.push(new_goal) 
}

function organiseDOM(list) {
    
    const items = document.querySelectorAll('.item'); // each individual item
    let row_number = { "value": 1 };

    // align items in DOM according to their depth and organise into a list
    for (const item of items) {
        alignItem(item, row_number);
        checkIfCompleted(item);
        buildGoalList(item, list);
    }

    // add children to to children array of correct parent
    for (parent of list) {
        for (child of list) {
            if (parent.id === child.parentId) {
                parent.addChild(child);  
            }
        }
    }
}

//increase input windows blackspace depedning on pos in DOM
// fix to bottom when input is close to the bottom
function determineInputPosition() {
    input = document.querySelector('#enter-goal-nav');
    pos = input.getBoundingClientRect();

    pb = 1000 - pos.y;
    let footerHeight = window.innerHeight - input.offsetTop

    if (pos.y > 900) {
        input.classList.add("fixed-bottom"); 
        //get width of header element and set footer to that
        /* header = document.getElementById("header-element"); */
        headerStyle = window.getComputedStyle(document.body);
        headerMargin = headerStyle.margin;
        headerWidth = document.body.clientWidth
        console.log(headerMargin);
        input.style.maxWidth = headerWidth + "px";
        input.style.margin = headerMargin;
        input.style.paddingBottom = "3em";
    } 
    else {
        /* input.style.paddingBottom = pb + "px"; */
    }
    styleFooter(footerHeight);
} 

function styleFooter(footerHeight) {
    //const footer = document.getElementById("enter-goal-nav");
    const footerSlab = document.getElementById("bg-footer");
    footerSlab.style.height = footerHeight + "px";
    console.log(footer.offsetHeight);
    
}




    //now that children are assigned to correct parent, add them to the set with flattenedChildren

    /* for (e of goal_arr) {
        flattenChildren(e);  
    } */

    // reveals form to add new goal
/*     for (const button of add_goal_buttons) {
        button.addEventListener('click', function(event) {  
            const inserted_goal = button.nextElementSibling;
            console.log(inserted_goal)
            inserted_goal.style.display = "block";
        })  
    }
 */
/*     for (const tick of ticks) {
        tick.addEventListener('click', function(event) {
            disable(tick);
        }) 
    }
 */


 

            
       
   

    

    //when button is clicked on, hide/show all children
    /* for (const btn of title_btns) {
        btn.addEventListener('click', function(event) {  
            let id = btn.id.split('_')[1]; 
            for (const parent of goal_arr) {
                if (id === parent.id) {  
                    hideElements(parent.children, parent.closed);
                    parent.closed = !parent.closed;
                }     
            }
        });
    } */
