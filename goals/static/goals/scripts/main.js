document.addEventListener('DOMContentLoaded', () => {

    const scrollPos = JSON.parse(document.getElementById('scroll').textContent);


    let goalArr = [];
    const form = document.querySelector("#new-goal-form");
    const editForms = document.querySelectorAll(".edit-goal-form");
    const plusForms = document.querySelectorAll(".plusForm")
    const deleteForms = document.querySelectorAll(".cross.circle");
    let formChildren = form.children;
    
    addClickEvent(disable, '.tick');
    // addClickEvent(prepareToAddGoal, '.plus', formChildren);
    addClickEvent(showHideChildren, '#arrow_button', goalArr);
    organiseDOM(goalArr);  
    applyCorrectFormValues(formChildren);

    form.onsubmit = validate;
    //// console.log(deleteForms);

    

    for (let e of editForms) {
        e.onsubmit = postEdit;
    }

    for (let e of plusForms) {
        // // console.log(e)
        e.onsubmit = addScrollValues;
    }

    for (let e of deleteForms) {
        e.onsubmit = addScrollValues;
        //// console.log(e);
    }

    

    let input = document.querySelector("#add-goal-input-box");
    // // console.log(input);

    input.addEventListener('keyup', (event) => {
        countGoal(event);
    })

    const cont = document.querySelector(".container");
    //// console.log(cont.scrollLeft, cont.scrollTop);
    // cont.scrollTop = scrollPos.yPos;
    // cont.scrollLeft = scrollPos.xPos;
    // cont.scrollTo(scrollPos.yPos, scrollPos.xPos)
    cont.scrollTo(scrollPos.xPos, scrollPos.yPos)
    
    if (scrollPos.hasOwnProperty("id")) {
        const getById = `#id_${scrollPos.id}`;
        const newGoal =  document.querySelector(getById);
        newGoal.value = "";
        newGoal.focus();
        //// console.log(scrollPos.xPos, scrollPos.yPos)
        cont.scrollTo(scrollPos.xPos, scrollPos.yPos)
        newGoal.scrollIntoView({block: 'start', behavior: 'smooth'});

      
    }

});

function addScrollValues(e) {
    // console.log("farty");
    
    let cont = document.querySelector(".container");
    
    e.target.elements["scrollYpos"].value = cont.scrollTop;
    e.target.elements["scrollXpos"].value = cont.scrollLeft;


    // console.log(e.target.elements["scrollYpos"]);
    
}

function getIntFromId(element) {
    const id_element = element.id.split(' ')[1]; 
    const id = id_element.split('-')[1];
    // console.log(`id ${id}`);
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
        // // console.log(element);
        
        element.parentElement.parentElement.parentElement.parentElement = "20%";
        element.parentElement.parentElement.parentElement.disabled = true;
        element.parentElement.parentElement.parentElement.parentElement = "20%";
        // element.nextElementSibling.nextElementSibling.style.opacity = "20%";
        
        // element.nextElementSibling.nextElementSibling.disabled = true;
        
        // element.parentElement.previousElementSibling.style.opacity = "20%";
        //hide tick and reveal cross
        // // console.log(`eelement: ${element.nextElementSibling.classList}`)
        element.hidden = true;
        element.nextElementSibling.hidden = false;
        const plus = element.nextElementSibling.nextElementSibling;
        plus.classList.add("hidden");
        plus.nextElementSibling.classList.remove("hidden");
        
    } 
}



// change focus to be on text input box 
// when goal is added, will be added as a sub goal to the clicked goal
// function prepareToAddGoal(button, form_children) {

//     const parent = button.parentElement.parentElement.parentElement.parentElement;
//     // console.log("pare: " + parent.classList);
//     const parent_id = getIntFromId(parent);
//     const depth_id = getValueFromClass(parent, "depth");

//     // - change form id and depth to necessary values
//     for (const child of form_children) {
//         if (child.name == "parent") {
//             child.setAttribute("value", parent_id);
//         }
//         else if (child.name == "depth_id") {
//             child.setAttribute("value", depth_id);
//         }
//         else if (child.name == "new_goal"){
//             child.focus();  // jump cursor to text input box 
//         }
//     }
// }


//when button is clicked on, hide/show all children
function showHideChildren(button, list) {
    
    // // console.log(button.previousElementSibling.children[4]);
    // let id = button.previousElementSibling.children[4].id.split('_')[1]; 
    let id  = button.previousElementSibling.children[2].value;
    for (const parent of list) {
        const newForm = new FormData();
        
        formDict = {
            "parent_id":new Set(),
            "child_id":new Set(),
            "hidden":[]
        }
        // // console.log(button.previousElementSibling);
        if (id === parent.id) {
            hideElements(parent, parent.children, parent.closed, formDict);
            newForm.append("name", "closeForm");
            newForm.append("parent_id", Array.from(formDict["parent_id"]));
            newForm.append("child_id", Array.from(formDict["child_id"]));
            newForm.append("hidden", !parent.closed);
            newForm.append("csrfmiddlewaretoken", document.getElementsByName('csrfmiddlewaretoken')[0].value)
            console.log(formDict["child_id"])
            close(newForm);

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
function hideElements(parent, arr, closed, formDict) {


    closeList = []


    // const newForm = new FormData();

    for (child of arr) {

        data = {
            "parent_id": parent.id,
            "child_id": child.id,
            "hidden": !closed
        } 

        // const form = new FormData();
        // form.append("name", "closeForm");

        // form.append("parent_id", parent.id);
        formDict["parent_id"].add(parent.id)
        // console.log(child.id)
        // form.append("child_id", child.id);
        // newForm.append("child_id", child.id);
        formDict["child_id"].add(child.id)

        // form.append("hidden", !closed);
        formDict["hidden"].push(!closed)

        // form.append("csrfmiddlewaretoken", document.getElementsByName('csrfmiddlewaretoken')[0].value)
        //// console.log(form);

        // sends instructions to close/open to DB
        // close(data); 
        // close(form);
        // closeList.push(form)

        if (closed) { // then open
            child.hiddenByParent = false;
            child.htmlElemment.style.display = "block";    
            if (!child.closed && child.children.length > 0) {
                hideElements(child, child.children, true, formDict )       
            } 
        }
        else { // then close all elemnts and their subs;
            child.hiddenByParent = true;
            child.htmlElemment.style.display = "none";
            if (child.children.length > 0) { 
                hideElements(child, child.children, false, formDict );
            }  
        } 
    }

    // close(form);
    // console.log("once")
    // const newForm = new FormData();
    // newForm.append("name", "closeForm");
    // newForm.append("parent_id", formDict["parent_id"]);
    // // newForm.append("child_id", formDict["child_id"]);
    // newForm.append("hidden", formDict["hidden"][0]);
    // newForm.append("csrfmiddlewaretoken", document.getElementsByName('csrfmiddlewaretoken')[0].value)
    // console.log(formDict["child_id"])
    // close(newForm);


}

// position goal items on the DOM according to their depth
function alignItem(item, row_number, childCount) {
    // // console.log(item.children[0].children[0].children[0]);
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
    // // console.log(arrow);
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
        // // console.log("span is:" + span.innerHTML);
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

function close(form) {

    // const serializedFrom = $(form).serialize();
    // // console.log(serializedFrom);
    // $.post("", form);
    

    $.ajax({
        type: "POST",
        url: "",
        data: form,
        processData: false,
        contentType: false
      });

     


    //todo: Sue $.post() and send as FormData
    // $.ajax({
    //     url:'',
    //     type:'POST',
    //     data: { 
    //         "data": JSON.stringify(data),
    //         csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value },
    //     dataType: 'json'
    // })
}

// Post form data to server and remove focus from form
function postEdit(form) {
    
    form.preventDefault();
    form.target.elements["new_goal"].blur();

    // creates a text string in standard URL-encoded notation of the form values
    const serializedFrom = $(this).serialize();
    $.post("", serializedFrom);

    // e.target.children[3].blur();
    // const value = e.target.children[3].value

    // const editForm = document.forms["editForm"]

    // data = {
    //     "id":e.target.children[2].value,
    //     "goal":value
    // }

    // // console.log($(this).serialize());

   
        

    // // console.log(bobby);
    // var loginForm = document.forms["editForm"];
    // // console.log(loginForm);

    // // console.log(data);

    

    // $.ajax({
    //     url:'',
    //     type:'POST',
    //     data: {
    //         "edit_data": JSON.stringify(data),
    //         csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value },
    //     dataType: 'json'
    // })
}





   

