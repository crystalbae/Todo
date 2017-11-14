import React, { Component } from 'react';

class AllCompleted extends Component {
  constructor(props) {
    super(props);
    this.allCompleted = this.allCompleted.bind(this);
  }

  allCompleted() {
    this.state = { todoList: this.props.todoList };

    let todoList = this.state.todoList;
    var todoCompleteCheck = 0;
    let todoItem = document.getElementsByClassName("todo-item");

    for(let i in todoList) {
      if(!todoList[i].isCompleted) {
        // 전체 complete check
        for(let j in todoList) {
          todoList[j].isCompleted = true;
        }
        this.setState({ todoList });
        this.setState({ count: 0 });
        for(var k = 0; k < todoItem.length; k++) {
          todoItem[k].classList.add("active");
        }

        this.props.onInsert(this.state.todoList, 0);
        return;
      }
      todoCompleteCheck += 1;
    }

    if(todoCompleteCheck === todoList.length) {
      // 전체 complete check 해제
      for(let i in todoList) {
        todoList[i].isCompleted = false;
      }
      this.setState({ todoList });
      this.setState({ count: this.state.todoList.length });
      for(var j = 0; j < todoItem.length; j++) {
        todoItem[j].classList.remove("active");
      }
    }
    
    this.props.onInsert(this.state.todoList, this.state.todoList.length);
  }

  render() {
    return (
      <button onClick={this.allCompleted}>all completed</button>
    );
  }
}

export default AllCompleted;
