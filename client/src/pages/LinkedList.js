class Node {
    constructor(data) {
        this.data = data;
        this.next = null; // initialize the next pointer to null
    }
}

export class LinkedList {
    constructor() {
        this.head = null;
        this.current = null; // setting to null for node path 
    }

    insert(data) {
        const newNode = new Node(data); // creating new node with provided data
        if (!this.head) { // check if the list is empty
            this.head = newNode;
            this.current = newNode; // if empty the set current(new node) to head of list
        } else {
            let current = this.head; // if there is data in the linked list
            while (current.next) {
                current = current.next;
            }
            current.next = newNode;
        }// traverse the list to add new data appropriately
    }

    //gets current prompt
    getCurrent() { 
        return this.current ? this.current.data : null;
    }

    //next in list
    next() {
        if (this.current && this.current.next) {
            this.current = this.current.next;
        } else {
            this.reset();
        }
    }

    // reset 
    reset() {
        this.current = this.head;
    }

    // resets the list or goes to the next prompt
    resetOrNext() {
        if (!this.current || !this.current.next) {
            this.reset();
        } else {
            this.next();
        }
    }
}
