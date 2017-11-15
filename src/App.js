import React, { Component } from 'react'
import TodoAdd from './TodoAdd'
import Todo from './Todo'
import Detail from './Detail'
import update from 'react-addons-update'
import './css/App.css'
import './css/TodoList.css'
import './css/TodoDetail.css'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      todoList: [],
      count: 0,
      selectedTodo: null,
      isSelected: false
    };

    this.updateTodo = this.updateTodo.bind(this); // todo를 추가할때 todoList를 update.
    this.removeTodo = this.removeTodo.bind(this); // todo를 제거할때 todoList를 update.
    this.removeSubtask = this.removeSubtask.bind(this); // todo의 subtask를 제거할때 todoList를 update.
    this.updateSubtask = this.updateSubtask.bind(this); // todo의 subtask를 추가할때 update.
    this.selectTodo = this.selectTodo.bind(this); // todo를 선택할때 selectedTodo에 저장.
    this.checkTodo = this.checkTodo.bind(this); // todo의 완료 여부를 check.
    this.updateTodoTitle = this.updateTodoTitle.bind(this); // todo의 이름을 변경한다.
    this.dragStartHandler = this.dragStartHandler.bind(this);
    this.dragOverHandler = this.dragOverHandler.bind(this);
    this.dragEnterHandler = this.dragEnterHandler.bind(this);
    this.dropHandler = this.dropHandler.bind(this);

    Array.prototype.move = function(from,to){
      this.splice(to,0,this.splice(from,1)[0]);
      return this;
    };
  }

  checkTodo(todo, count) { // todo의 완료여부를 체크한다.
    this.setState({ todoList: todo, count: count });
  }

  selectTodo(selectedTodo, todoList, isSelected) { // 선택된 selectedTodo는 우측 화면에 세부사항을 보여준다.
    this.setState({ selectedTodo: selectedTodo, todoList: todoList, isSelected: isSelected });
  }

  updateTodo(todoList, count) { // TodoAdd를 통해 todo를 추가할때, todoList를 업데이트한다.
    this.setState({ todoList: todoList, count: count });
  }

  removeTodo(todoList, count, selectedTodo, isSelected) { //Todo에서 todo를 삭제할때, todoList를 업데이트한다.
    this.setState({ todoList: todoList, count: count, selectedTodo: selectedTodo, isSelected: isSelected });
  }

  removeSubtask(todoList) { //Tododetail에서 subtask를 삭제할때, todoList를 업데이트한다.
    this.setState({ todoList: todoList });
  }

  updateTodoTitle(todo) {
    this.setState({ todoList: update (
      this.state.todoList, { [todo.index]: { "item": { $set: todo.todo }}}
    )});
  }

  updateSubtask(todoList) { // Todo의 Subtask를 업데이트한다.
    this.setState({ todoList: todoList });
  }

  dragStartHandler(e) {
    if(/MSIE \d|Trident.*rv:/.test(navigator.userAgent)) {
      let data = e.target.className;
      e.dataTransfer.setData("text/plain", data);
    } else {
      let data = parseInt(e.target.className, 10);
      e.dataTransfer.setData("text/plain", data);
    }
    // e.dataTransfer.dropEffect = "move";
  }

  dragOverHandler(e) {
    e.preventDefault(); // html 요소에 뭔가를 드롭했을 때 아무 일도 일어나지 않도록 함.
    e.dataTransfer.dropEffect = "move";
  }

  dragEnterHandler(e) {
    if (e.target.tagName !== "UL") {
      e.target.classList.add("active");
    }
  }

  dragLeaveHandler(e) {
    e.target.classList.remove("active");
  }

  dropHandler(e) {
    e.preventDefault();
    e.target.classList.remove("active");
    let dragElemIndex = e.dataTransfer.getData("text");
    let dropElemIndex = e.target.classList[0];

    if (dragElemIndex < dropElemIndex) {
      if (dragElemIndex+1 !== dropElemIndex) {
        this.state.todoList.move(dragElemIndex, dropElemIndex-1);
      }
    } else if (dragElemIndex > dropElemIndex) {
      this.state.todoList.move(dragElemIndex, dropElemIndex);
    }
    this.setState(this.state.todoList);

    /* drop할때 selected된 todo가 있을 경우에는 selectedTodo의 index도 함께 변경하기 */
    if (this.state.selectedTodo !== null) {
      // console.log("drag index: " + dragElemIndex + " , " + "drop index: " + dropElemIndex + " , " + "selected index: " + this.state.selectedTodo.index);
      if (dragElemIndex < this.state.selectedTodo.index && dropElemIndex > this.state.selectedTodo.index) {
        // selected index - 1
        this.setState({
          selectedTodo: update( this.state.selectedTodo, {
            "index": { $set: (this.state.selectedTodo.index-1).toString() }
          })
        }, () => {
          // console.log(this.state.selectedTodo.index);
        });
      } else if (dragElemIndex > this.state.selectedTodo.index && dropElemIndex <= this.state.selectedTodo.index) {
        // selected index + 1
        this.setState({
          selectedTodo: update( this.state.selectedTodo, {
            "index": { $set: (parseInt(this.state.selectedTodo.index)+1).toString() }
          })
        }, () => {
          // console.log(this.state.selectedTodo.index);
        });
      } else if (dragElemIndex == this.state.selectedTodo.index) {
        if (dragElemIndex < dropElemIndex) {
          if (dragElemIndex+1 !== dropElemIndex) {
            this.setState({
              selectedTodo: update( this.state.selectedTodo, {
                "index": { $set: (dropElemIndex-1).toString() }
              })
            });
          }
        } else if (dragElemIndex > dropElemIndex) {
          this.setState({
            selectedTodo: update( this.state.selectedTodo, {
              "index": { $set: (dropElemIndex).toString() }
            })
          });
        }


      }
    }
  }

  render() {
    return (
      <div className="App">
        <div className="todo-list-page">
          <TodoAdd todoList={this.state.todoList}
                   count={this.state.count}
                   onUpdate={this.updateTodo} />
          <Todo todoList={this.state.todoList}
                count={this.state.count}
                selectedTodo={this.state.selectedTodo}
                isSelected={this.state.isSelected}
                onRemove={this.removeTodo}
                onUpdate={this.updateTodo}
                dragStart={this.dragStartHandler}
                dragOver={this.dragOverHandler}
                dragEnter={this.dragEnterHandler}
                dragLeave={this.dragLeaveHandler}
                drop={this.dropHandler}
                selectTodo={this.selectTodo}
                checkTodo={this.checkTodo} />
        </div>
        <div id="todo-detail-page">
          <Detail selectedTodo={this.state.selectedTodo}
                  todoList={this.state.todoList}
                  onUpdate={this.updateSubtask}
                  selectTodo={this.selectTodo}
                  removeSubtask={this.removeSubtask}
                  updateTodoTitle={this.updateTodoTitle} />
        </div>
      </div>
    );
  }
}

export default App;
