class Goal {

    id;
    parentId;
    closed;
    children;
    htmlElemment;
    order;

    // closed means all imediate childen become "hidden by parent"
    // hiddden by parent means the current obj and all its children are hidden by parent
    // so closed vs hbp is closed does not hide the "closed" obj
    // Also if an obj is revelaed and no longer hidden py parent, closed will be unaffected
    constructor(id, parentId, closed, hidden, html) {
        this.id = id;
        this.parentId = parentId;
        this.completed = false; 
        this.closed = closed; // this is when all the children will be hiddenByParent
        // so first check if for hiddenByParent, then if true, check for hidden
        this.hiddenByParent = hidden;
        this.children = [];
        this.htmlElemment = html;
        this.order = 0;
        
    }

    complete() {
        this.completed = true;
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

    

    getAllChildren(count, children) {
        
        for (var e of children) {
            count += this.getAllChildren(count, e.children);
        }
        return count += children.length;
    }

    numberOfChildren() {
        return this.getAllChildren(0, this.children);
    }

    getSpan() {
        return this.htmlElemment.children[0].children[0].children[0];
    }
}