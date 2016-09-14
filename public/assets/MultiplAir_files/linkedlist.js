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
    if (currentNode.next.data == val) {
      return currentNode;
    }  
    currentNode = currentNode.next;


  } while (currentNode !== this.head);

}

LinkedList.prototype.findNode = function (val) {

  var currentNode = this.head; 

  do {
    if (currentNode.data == val) {
      return currentNode;
    }  
    currentNode = currentNode.next;


  } while (currentNode !== this.head);

}
//Convert {client.id: target.id, client2.id: target2.id, ...}
LinkedList.prototype.flattenTargets = function () {

  var targetsHash = {}; 
  var currentNode = this.head;

  do {
    targetsHash[currentNode.data] = currentNode.next.data 
    currentNode = currentNode.next;

  } while (currentNode !== this.head);
  return targetsHash;
}
LinkedList.prototype.deleteNode = function (val) {

  // If linked list is empty
  if (!this.head) {
    console.log('Linked list is empty.');
    return;
  }
  // if you have to delete the head
  if (this.head.data == val) {
      this.head = this.head.next;
      this.tail.next = this.head;

  } else {
    var nodeBeforeDelete = this.findNodeBeforeDelete (val);
    var nodeToDelete = nodeBeforeDelete.next;

    nodeBeforeDelete.next = nodeToDelete.next;

    if (this.tail.data == val) {
      this.tail = nodeBeforeDelete;
    }
  }
  this._length--;
};
