class Node {
    constructor(data) {
        this.data = data;
        this.next = null;
    }
}

export class LinkedList {
    constructor() {
        this.head = null;
        this.current = null;
    }

    insert(data) {
        const newNode = new Node(data);
        if (!this.head) {
            this.head = newNode;
            this.current = newNode;
        } else {
            let current = this.head;
            while (current.next) {
                current = current.next;
            }
            current.next = newNode;
        }
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
