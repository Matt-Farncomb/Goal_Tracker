document.addEventListener('DOMContentLoaded', () => {

    // received from server
    const scrollPos = JSON.parse(document.getElementById('scroll').textContent);

    let goalArr = [];
    const cont = document.querySelector(".container");

    addEvent(".edit-goal-form", postEdit, 'submit', cont);
    addEvent(".plusForm", addScrollValues, 'submit', cont);
    addEvent(".cross.circle", addScrollValues, 'submit', cont);
    addEvent(".scroll-arrow", scrollAcross, 'click', cont);
    addEvent(".tick", disable, 'click');
    addEvent("#arrow_button", showHideChildren, 'click', cont, goalArr);
    addEvent(".title", countGoal, 'keyup');
    addEvent("#add-goal-input-box", countGoal, 'keyup');
    addEvent("#new-goal-form", validate, 'submit');

    organiseDOM(goalArr);  

    cont.scrollTo(scrollPos.xPos, scrollPos.yPos)
    
    // when new goal was added, scroll animation to the new added goal
    if (scrollPos.hasOwnProperty("id")) {
        const getById = `#id_${scrollPos.id}`;
        const newGoal =  document.querySelector(getById);
        newGoal.value = "";
        newGoal.focus();
        // focus moves scroll to the focused element, so reverse that
        cont.scrollTo(scrollPos.xPos, scrollPos.yPos)
        // then scroll smoothly to the focused element
        newGoal.scrollIntoView({block: 'start', behavior: 'smooth'});
    }
});

/**
 * Scroll to the left or right
 * @param {Event} click Click event
 */
function scrollAcross(click) {
    const scrollSpeed = 20;  
    const container = this[0];
    container.scrollLeft +=  (click.target.id == "left-scroll") ? -scrollSpeed : scrollSpeed
}

/**
 * Update form of clicked on element with scroll pos values
 * @param {Event} click Click event
 */
function addScrollValues(click) { 
    click.target.elements["scrollYpos"].value = this[0].scrollTop;
    click.target.elements["scrollXpos"].value = this[0].scrollLeft;
}

/**
 * Get goal id from provided HTML element
 * @param {HTMLElement} element
 */
function getIntFromId(element) {
    const id_element = element.id.split(' ')[1]; 
    const id = id_element.split('-')[1];
    return id
}

/**
 * Every key press, make sure value of form is below minimum length
 * @param {Event} keyup Keyup event
 */
function countGoal(keyup) {
    const target = keyup.target;
    const valueLength = target.value.length;
    if (valueLength >= target.maxLength) {
        if (!target.classList.contains("tooLong"))  target.classList.add("tooLong");
    }
    else target.classList.remove("tooLong");

}

/**
 * Stop form value from submitting if length above maximum
 * @param {Event} submit Submit event
 */
function validate(submit) {
    const newGoal = submit.target.elements["new_goal"].value;
    const MAX_WORD_LENGTH = 29; // longest word in English

    if (newGoal.length == 0)  submit.preventDefault();
    else if (newGoal.length > MAX_WORD_LENGTH) {
        const words =  newGoal.split(' ');
        words.forEach(word => {
            if (word.length > MAX_WORD_LENGTH) {
                alert("Maximum word length is 29 characters");
                submit.preventDefault();
            }
        });
    } 
}


/**
 * Add 'event' that calls 'func' to all instances of 'element'
 * @param {string} element HTML elements that will have the event added to them.
 * @param {function} func Callback function to be added to element upon event.
 * @param {string} event String of event.
 * @param {Array<Goal>} args Extra args for specifi use cases
 */
function addEvent(element, func, event, ...args) {
    document.querySelectorAll(element).forEach(
        e => e.addEventListener(event,  func.bind(args) )
    )
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


//when button is clicked on, hide/show all children
function showHideChildren(button) {
    
    // // console.log(button.previousElementSibling.children[4]);
    // let id = button.previousElementSibling.children[4].id.split('_')[1]; 
    let list = this[1];
    let id  = button.target.parentElement.value;
    for (const parent of list) {
        const newForm = new FormData();
        
        formDict = {
            "parent_id":new Set(),
            "child_id":new Set(),
            "hidden":[]
        }
        
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


//recursively hide/show all elements in arr
function hideElements(parent, arr, closed, formDict) {

    for (child of arr) {

        formDict["parent_id"].add(parent.id);
        formDict["child_id"].add(child.id);
        formDict["hidden"].push(!closed);

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
}

// position goal items on the DOM according to their depth
function alignItem(item, row_number, childCount) {
    // retrieve required item depth
    let item_depth = getValueFromClass(item, "depth");
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

// Post form data to server and remove focus frosm form
function postEdit(e) {
   
    let form = e.target;
    e.preventDefault();
    e.target.elements["new_goal"].blur();

    // creates a text string in standard URL-encoded notation of the form values
    const serializedFrom = $(form).serialize();
    $.post("", serializedFrom);

}





   

