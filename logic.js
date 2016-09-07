function Node(data) {
    this.data = data;
    this.next = null;
}

function LinkedList () {
    this.head = null;
    this.tail = null;
    this._length = 0;
}

LinkedList.prototype.insertNodeAtTail = function (val) {
    var node = new Node(val)

    if (!this.head) {
        this.head = node;
        this.head.next = this.head;
        this.tail = this.head;
        

    } else {
        this.tail.next = node;
        this.tail = node;
        this.tail.next = this.head

    }

    this._length++;
};

LinkedList.prototype.findNodeBeforeDelete = function (val) {

  var currentNode = this.head; 

  do {
    if (currentNode.next.data === val) {
      return currentNode;
    }  
    currentNode = currentNode.next;


  } while (currentNode !== this.head);

}




LinkedList.prototype.deleteNode = function (val) {

  // If linked list is empty
  if (!this.head) {
    console.log('Linked list is empty.');
    return;
  }
  // if you have to delete the head
  if (this.head.data === val) {
      this.head = this.head.next;
      this.tail.next = this.head;

  } else {
    var nodeBeforeDelete = this.findNodeBeforeDelete (val);
    var nodeToDelete = nodeBeforeDelete.next;

    nodeBeforeDelete.next = nodeToDelete.next;

    if (this.tail.data === val) {
      this.tail = nodeBeforeDelete;
    }
  }
  this._length--;
};

// Create an instance of a LinkedList class
var L1 = new LinkedList();

// Create a linked list with six elements
L1.insertNodeAtTail(1);
L1.insertNodeAtTail(2);
L1.insertNodeAtTail(3);
L1.insertNodeAtTail(4);
L1.insertNodeAtTail(5);
L1.insertNodeAtTail(6);
console.log(L1);

console.log(L1.findNodeBeforeDelete(6));

L1.deleteNode(6);
console.log(L1);

// // // Delete a head and a tail node
// L1.deleteNode(6);
// // L1.deleteNode(10);
// console.log(L1);

// // // Delete  an intermediate node
// L1.deleteNode(4);
// console.log(L1);