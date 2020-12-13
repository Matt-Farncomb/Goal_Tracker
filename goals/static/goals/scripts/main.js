document.addEventListener('DOMContentLoaded', () => {
    
    let goalArr = [];
    const form = document.querySelector("#new-goal-form");
    let formChildren = form.children;
    
    addClickEvent(disable, '.tick');
    addClickEvent(prepareToAddGoal, '.plus', formChildren);
    addClickEvent(showHideChildren, '#arrow_button', goalArr);
    organiseDOM(goalArr);  
    applyCorrectFormValues(formChildren);

    form.onsubmit = validate;

    let input = document.querySelector("#add-goal-input-box");
    // console.log(input);

    input.addEventListener('keyup', (event) => {
        countGoal(event);
    })
    

});

function getIntFromId(element) {
    const id_element = element.id.split(' ')[1]; 
    const id = id_element.split('-')[1];
    return id
}

function countGoal(e) {
    const target = e.target;
    const valueLength = target.value.length;
    if (valueLength >= target.maxLength) {
        if (!target.classList.contains("tooLong"))  target.classList.add("tooLong");
    }
    else target.classList.remove("tooLong");

}



function validate(e) {
    const newGoal = e.target.elements["new_goal"].value;
    const MAX_WORD_LENGTH = 29; // longest word in English

    if (newGoal.length == 0)  e.preventDefault();
    else if (newGoal.length > MAX_WORD_LENGTH) {
        const words =  newGoal.split(' ');
        words.forEach(word => {
            if (word.length > MAX_WORD_LENGTH) {
                alert("Maximum word length is 29 characters");
                e.preventDefault();
            }
        });
    } 
}

// make sure the created goal has the values of the correct parent
// eg - the goal it was created under or the main page
function applyCorrectFormValues(form_children) {
    goalFocusDict = { "inputBox": form_children[4] , "submitButton": form_children[5] }
    document.addEventListener('click', () => {
        checkFocus(goalFocusDict, resetFormValues)
    })
}

// when any 'element' is clicked on, perform 'func'
function addClickEvent(func, element, list) {
    document.querySelectorAll(element).forEach(
        ele => ele.addEventListener('click', () => {
           func(ele, list);
    })
)}

// reset values of form to refer to the 0'th level
function resetFormValues(element) {
    element.children[2].value = "None"; //  parent_id_input
    element.children[3].value = 0; //  depth_id_input
}

function checkFocus(elementToCheck, func){
    if (!document.activeElement in elementToCheck) {
        func(elementToCheck.inputBox.parentElement); 
    }
}

// when item has been 'ticked', make it appear disabled, hide the tick and reveal the delete button
function disable(element) {
    if (!element.classList.contains("disabled")) { 
        // Make text content and add button greyed out
        // console.log(element);
        element.nextElementSibling.nextElementSibling.style.opacity = "20%";
        
        element.nextElementSibling.nextElementSibling.disabled = true;
        
        element.parentElement.previousElementSibling.style.opacity = "20%";
        //hide tick and reveal cross
        element.hidden = true;
        element.nextElementSibling.hidden = false;
    } 
}

// change focus to be on text input box 
// when goal is added, will be added as a sub goal to the clicked goal
function prepareToAddGoal(button, form_children) {

    //get id
    const parent = button.parentElement.parentElement.parentElement;
    const parent_id = getIntFromId(parent);
    const depth_id = getValueFromClass(parent, "depth");

    // - change form id and depth to necessary values
    for (const child of form_children) {
        if (child.name == "parent") {
            child.setAttribute("value", parent_id);
        }
        else if (child.name == "depth_id") {
            child.setAttribute("value", depth_id);
        }
        else if (child.name == "new_goal"){
            child.focus();  // jump cursor to text input box 
        }
    }
}


//when button is clicked on, hide/show all children
function showHideChildren(button, list) {
    // console.log(button.previousElementSibling.children[4]);
    let id = button.previousElementSibling.children[4].id.split('_')[1]; 

    for (const parent of list) {
        
        if (id === parent.id) {

            hideElements(parent, parent.children, parent.closed);
            parent.closed = !parent.closed;
            
            allocateArrow(parent);
           
        }     
    }
}

//store each individual file in a set, eliminating any duplciates
//1: Adds child to set
//2: Looks in child's children array
//3: If the child from the children array is not in set:
//3a: Change its order value
//3b: Call the flatten function and go back to step 1, inserting this child into function
// function flattenChildren(child) {
//     flattenedChildren.add(child);
//     for (child of child.children) {
//         if (!flattenedChildren.has(child)){
//             //change order of child
//             child.htmlElemment.style.order = child_order;
//             child_order++;
//             flattenChildren(child);         
//         }    
//     }       
// }


//recursively hide/show all elements in arr
function hideElements(parent, arr, closed) {
    for (child of arr) {

        data = {
            "parent_id": parent.id,
            "child_id": child.id,
            "hidden": !closed
        } 

        // sends instructions to close/open to DB
        close(data); 

        if (closed) { // then open
            child.hiddenByParent = false;
            child.htmlElemment.style.display = "block";    
            if (!child.closed && child.children.length > 0) {
                hideElements(child, child.children, true )       
            } 
        }
        else { // then close all elemnts and their subs;
            child.hiddenByParent = true;
            child.htmlElemment.style.display = "none";
            if (child.children.length > 0) { 
                hideElements(child, child.children, false );
            }  
        } 
    }
}

// position goal items on the DOM according to their depth
function alignItem(item, row_number, childCount) {
    // console.log(item.children[0].children[0].children[0]);
    // retrieve required item depth
    // const item_class = item.className;
    let item_depth = getValueFromClass(item, "depth");
    // let item_depth = parseInt(item_class.split('depth_id_')[1]);
    // align item according to its depth
    item.style.gridColumnStart = item_depth;
    item.style.gridColumnEnd = item_depth+5; 
    item.style.gridRowStart = row_number.value;
    row_number.value++;
   
}

function checkIfCompleted(item) {
    const is_completed = getValueFromClass(item, "completed");
    if (is_completed) {
        // disable function starts at tick form, so must bring item to that depth in html tree
        // disable(item.children[0].children[1].children[0]);
        disable(item.children[0].children[2].children[0]);
    }
}

// returs the db value at the end of any class (bools, ints etc)
function getValueFromClass(item, string) {

    function getIdFromClassName(string) {
        const split = item.className.split(/\s+/);
        for (var e of split) {
            if (e.includes(string)) {
                return e.substring(string.length + 4)
            }
        }
    }

    if (string == "parent" || string == "depth" ) return getIdFromClassName(string);
    else {
        const classList = item.classList;
        if (classList.contains(string + "_True" )) return true 
        else if (classList.contains(string + "_False" )) return false
    }  
}

// build up a list of goals and their children
// the list is used to know which child belongs to which parent
// so that when one is closed, it will close the children in the tree
function buildGoalList(htmlElement, list) {

    const id = getIntFromId(htmlElement)
    const parentId = getValueFromClass(htmlElement, "parent");
    const is_hidden = getValueFromClass(htmlElement, "hidden");
    const is_closed = getValueFromClass(htmlElement, "closed");

    let new_goal = new Goal(id, parentId, is_closed, is_hidden, htmlElement)

    list.push(new_goal) 
}

function allocateArrow(goal) {
    // let span = goal.getSpan();
    // span.firstElementChild.className = goal.closed ? "fas fa-arrow-down" : "fas fa-arrow-up";
    let arrow = goal.htmlElemment.children[0].children[1].children[0];
    // console.log(arrow);
    arrow.className = goal.closed ? "fas fa-arrow-down" : "fas fa-arrow-up";
}

function organiseDOM(list) {
    
    const items = document.querySelectorAll('.item'); // each individual item
    let row_number = { "value": 1 };
    let childCount = 0;

    // align items in DOM according to their depth and organise into a list
    for (const item of items) {
        alignItem(item, row_number, childCount);
        checkIfCompleted(item);
        // checkIfClosed(item);
        buildGoalList(item, list);
        childCount++;
    }

    // add children to to children array of correct parent
    for (parent of list) {

        for (child of list) {
            if (parent.id === child.parentId) {
                parent.addChild(child);  
            }
        }
        
        if (parent.hiddenByParent) parent.htmlElemment.style.display = "none";
 
        allocateArrow(parent);
    }   

    for (e of list) {
        // e.getSpan().innerHTML += "  " + e.numberOfChildren();
        let span = e.htmlElemment.children[0].children[1].children[1];
        // console.log("span is:" + span.innerHTML);
        span.innerHTML += "  " + e.numberOfChildren();

        
    }
}


function flatteGoals(child_arr, children) {
    for (var child of children) {
        child_arr.push(child.id);
        flatteGoals(child_arr, child.children);
    } 
    return child_arr;
}

function close(data) {

    $.ajax({
        url:'',
        type:'POST',
        data: { 
            "data": JSON.stringify(data),
            csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value },
        dataType: 'json'
    })
}





   

