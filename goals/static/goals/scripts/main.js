document.addEventListener('DOMContentLoaded', () => {

    // received from server
    const scrollPos = JSON.parse(document.getElementById('scroll').textContent);

    let goalArr = [];
    const cont = document.querySelector(".container");

    addEvent(".edit-goal-form", postEdit, 'submit', cont);
    addEvent(".plusForm", addScrollValues, 'submit', cont);
    addEvent(".cross.circle", addScrollValues, 'submit', cont);
    addEvent(".scroll-arrow", scrollAcross, 'click', cont);
    // addEvent(".tick", disable, 'click');
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
 * @param {} args Extra args for specifi use cases
 */
function addEvent(element, func, event, ...args) {
    document.querySelectorAll(element).forEach(
        e => e.addEventListener(event,  func.bind(args) )
    )
}



/**
 * When item has been 'ticked', make it appear disabled.
 * Hide the tick and reveal the delete button
 * Also hide the plus and reveal the undo button
 * @param {HTMLElement} tickForm Tick form that was ticked
 */
function disable(tickForm) {
    if (!tickForm.classList.contains("disabled")) { 
        const buttonCont = tickForm.parentElement;
        const itemCont = buttonCont.parentElement;
        const editGoalInput = itemCont.querySelector('[name="new_goal"]');
        const crossForm = buttonCont.querySelector('[name="crossForm"]');
        const plusForm = buttonCont.querySelector('[name="plusForm"]');
        const undoForm = buttonCont.querySelector('[name="undoForm"]');

        editGoalInput.disabled = true

        //hide tick and reveal cross
        tickForm.classList.add("hidden");
        crossForm.classList.remove("hidden");
        //hide plus and reveal undo
        plusForm.classList.add("hidden");
        undoForm.classList.remove("hidden"); 
    } 
}


/**
 * Show/hide all sub goals of clicked on goal
 * @param {Event} click click event
 */
function showHideChildren(click) {

    const arrowButton = click.target.parentElement;
    const goalArr = this[1];
    const clickedOnId  = arrowButton.value;

    for (const goal of goalArr) {
        
        const newForm = new FormData();
        
        formDict = {
            "parent_id":new Set(),
            "child_id":new Set(),
            "hidden":[]
        }
        
        if (clickedOnId === goal.id) {
            hideElements(goal, goal.closed, formDict);
            newForm.append("name", "closeForm");
            newForm.append("parent_id", Array.from(formDict["parent_id"]));
            newForm.append("child_id", Array.from(formDict["child_id"]));
            newForm.append("hidden", !goal.closed);
            newForm.append("csrfmiddlewaretoken", document.getElementsByName('csrfmiddlewaretoken')[0].value)
            // send form data to server so server knows which goals are hidden
            ajaxClose(newForm);

            goal.closed = !goal.closed;
            // allocate either up or down arrow
            allocateArrow(goal);
           
        }     
    }
}


/**
 * Recursively hide/show all elements in arr
 * @param {Goal} parent Goal object.
 * @param {Array<Goal>} children Array of parent's children goals.
 * @param {string} closed String of event.
 * @param {object} formDict Extra args for specifi use cases
 */
function hideElements(parent, closed, formDict) {

    for (child of parent.children) {

        formDict["parent_id"].add(parent.id);
        formDict["child_id"].add(child.id);
        formDict["hidden"].push(!closed);

        if (closed) { // then open
            child.hiddenByParent = false;
            child.htmlElemment.style.display = "block";    
            if (!child.closed && child.children.length > 0) {
                hideElements(child, true, formDict )       
            } 
        }
        else { // then close all elemnts and their subs;
            child.hiddenByParent = true;
            child.htmlElemment.style.display = "none";
            if (child.children.length > 0) { 
                hideElements(child, false, formDict );
            }  
        } 
    }
}

/**
 * Position goal items on the DOM according to their depth
 * @param {HTMLElement} item HTML element of item.
 * @param {number} row_number The row number of this item in the DOM.
 */
function alignItem(item, row_number) {
    // retrieve required item depth
    const item_depth = getValueFromClass(item, "depth");
    // align item according to its depth
    item.style.gridColumnStart = item_depth;
    item.style.gridColumnEnd = item_depth+5; 
    item.style.gridRowStart = row_number.value;
    row_number.value++;
}

/**
 * If this item has been ticked, it means it has been completed to disable it
 * @param {HTMLElement} insertedGoal HTML Element of insertedGoal
 */
function checkIfCompleted(insertedGoal) {
    const is_completed = getValueFromClass(insertedGoal, "completed");
    if (is_completed) {
        const tickForm = insertedGoal.querySelector('[name="tickForm"]');
        disable(tickForm);
    }
}

/**
 * Returns the value at the end of any class (bools, ints etc)
 * @param {HTMLElement} item HTML Element of item
 * @param {string} string Value requested: parent, depth or id
 * @returns {(string|boolean)} The value of the string in item
 */
function getValueFromClass(item, string) {

    /**
     * Returns the id from the end of a class name
     * @param {string} string Value requested
     * @returns {(string|boolean)} The id at the end of class named string
     */
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


/**
 * Build up a list of goals and their children
 * Array is used to know which child belongs to which parent
 * @param {HTMLElement} htmlElement
 * @param {Array} goalArr Array of all goals
 */
function buildGoalList(htmlElement, goalArr) {

    const id = getIntFromId(htmlElement)
    const parentId = getValueFromClass(htmlElement, "parent");
    const is_hidden = getValueFromClass(htmlElement, "hidden");
    const is_closed = getValueFromClass(htmlElement, "closed");

    let new_goal = new Goal(id, parentId, is_closed, is_hidden, htmlElement)

    goalArr.push(new_goal) 
}

/**
 * Allocate down arrow if closed, else up arrow
 * @param {Goal} goal instance of class goal that will have its arrow changed
 */
function allocateArrow(goal) {
    const itemContainer = goal.htmlElemment.firstElementChild;
    const arrowButton = itemContainer.children[1];
    const arrow = arrowButton.firstElementChild;
    arrow.className = goal.closed ? "fas fa-arrow-down" : "fas fa-arrow-up";
}


/**
 * Organise all the goals in the correct order and the correct depth
 * @param {HTMLElement[]} arr array of inserted goals
 */
function organiseDOM(arr) {
    
    const items = document.querySelectorAll('.item'); 
    let row_number = { "value": 1 };
    let childCount = 0;
    
    // align items in DOM according to their depth and organise into a list
    for (const item of items) {
        alignItem(item, row_number);
        checkIfCompleted(item);
        buildGoalList(item, arr);
        childCount++;
    }

    // add children to to children array of correct parent
    for (parent of arr) {

        for (child of arr) {
            if (parent.id === child.parentId) {
                parent.addChild(child);  
            }
        }
        
        if (parent.hiddenByParent) parent.htmlElemment.style.display = "none";
 
        allocateArrow(parent);
    }   

    // update span with number of sub goals for each goal
    for (e of arr) {
        const itemCont = e.htmlElemment.firstElementChild;
        const arrowButton = itemCont.children[1];
        const span = arrowButton.children[1];
        span.innerHTML += "  " + e.numberOfChildren();  
    }
}

/**
 * Post form data to server showing what items are now hidden
 * @param {FormData} form form data for goal
 */
function ajaxClose(form) {
    $.ajax({
        type: "POST",
        url: "",
        data: form,
        processData: false,
        contentType: false
      });
}

/**
 * Post edited goal form data to server
 * @param {Event} submit submit event called on editing goal
 */
function postEdit(submit) {
   
    let form = submit.target;
    submit.preventDefault();
    submit.target.elements["new_goal"].blur();

    // creates a text string in standard URL-encoded notation of the form values
    const serializedFrom = $(form).serialize();
    $.post("", serializedFrom);

}





   

