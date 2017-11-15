import React, { Component } from 'react'
import update from 'react-addons-update'
import './css/App.css'
import './css/TodoList.css'

class Todo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      todoList: null,
      count: null,
      selectedTodo: null
    };
    this.dragStart = this.dragStart.bind(this);
    this.dragOver = this.dragOver.bind(this);
    this.dragEnter = this.dragEnter.bind(this);
    this.dragLeave = this.dragLeave.bind(this);
    this.drop = this.drop.bind(this);
    this.checkTodo = this.checkTodo.bind(this);
  }

  mouseOver(index, e) {
    document.getElementById("close-"+index).classList.add("active");
  }

  mouseOut(index, e) {
    document.getElementById("close-"+index).classList.remove("active");
  }

  todoItemActive(i) { // todo item의 active 여부를 class로 return.
    let className = (this.props.todoList[i].isCompleted) ? "todo-item active" : "todo-item";
    return className
  }

  todoCheckboxActive(i) { // todo checkbox의 true or false를 return.
    let boolean = (this.props.todoList[i].isCompleted) ? true : false;
    return boolean;
  }

  closeButtonId(index) {
    return ("close-"+index);
  }

  todoId(index) {
    return ("todo-"+index);
  }

  dragStart(e) {
    this.props.dragStart(e);
  }

  dragOver(e) {
    this.props.dragOver(e);
  }

  dragEnter(e) {
    this.props.dragEnter(e);
  }

  dragLeave(e) {
    this.props.dragLeave(e);
  }

  drop(e) {
    this.props.drop(e);
  }

  removeItem(index, e) { // todo item을 제거한다.
    this.setState({
      todoList: this.props.todoList,
      count: this.props.count,
      selectedTodo: this.props.selectedTodo
    }, () => {
      if (!this.state.todoList[index].isCompleted) {
        this.setState({ count: this.state.count - 1 });
      }
      this.setState({
        todoList: update( this.state.todoList, {$splice: [[index, 1]]} )
      }, () => {
        if (this.props.selectedTodo !== null) { // 선택된 todo가 있을 경우.
          if (this.props.selectedTodo.index == index) {
            // 선택되어 있는 todo를 삭제할때 -> 우측 화면 닫힘 & selectedTodo를 비움.
            this.setState({
              selectedTodo: null
            }, () => {
              this.props.onRemove(this.state.todoList, this.state.count, this.state.selectedTodo, false);

              if(/MSIE \d|Trident.*rv:/.test(navigator.userAgent)) {
                document.getElementById("todo-detail-page").style.left = '-50%';
                document.getElementById("todo-detail-page").classList.remove("active");
              } else {
                document.getElementById("todo-detail-page").animate([
                  { left: '0%' },
                  { left: '-50%' }
                ], 200).addEventListener('finish', function() {
                  document.getElementById("todo-detail-page").style.left = '-50%';
                  document.getElementById("todo-detail-page").classList.remove("active");
                });
              }
            });
          } else if (this.props.selectedTodo.index > index) {
            this.setState({
              selectedTodo: {
                "index": (this.state.selectedTodo.index - 1).toString(),
                "todo": this.state.selectedTodo.todo
              }
            }, () => {
              this.props.onRemove(this.state.todoList, this.state.count, this.state.selectedTodo, true);
            });
          } else {
            this.props.onRemove(this.state.todoList, this.state.count, this.state.selectedTodo, true);
          }
        } else { // 선택된 todo가 없을 경우.
          this.props.onRemove(this.state.todoList, this.state.count, this.state.selectedTodo, false);
        }
      });
    });
  }

  selectTodo(index, e) { // todo item을 선택시 selectedTodo로 선택되어 우측 화면에 보여짐.
    if (e.target.tagName.toUpperCase() !== "INPUT" && e.target.tagName.toUpperCase() !== "BUTTON") {
      this.setState({
        todoList: this.props.todoList,
        selectedTodo: { "index": e.target.className, "todo": this.props.todoList[e.target.className].item }
      }, () => {
        if (this.props.isSelected) {
          if (this.props.selectedTodo.index == index) { // 이미 선택 된 todo가 있을 경우 & 같은 todo를 선택
            this.setState({
              todoList: update( this.state.todoList, {
                [index]: { "isSelected": { $set: false } }
              }),
              selectedTodo: null
            }, () => {
              if(/MSIE \d|Trident.*rv:/.test(navigator.userAgent)) {
                document.getElementById("todo-detail-page").style.left = '-50%';
                document.getElementById("todo-detail-page").classList.remove("active");
              } else {
                document.getElementById("todo-detail-page").animate([
                  { left: '0%' },
                  { left: '-50%' }
                ], 200).addEventListener('finish', function() {
                  document.getElementById("todo-detail-page").style.left = '-50%';
                  document.getElementById("todo-detail-page").classList.remove("active");
                });
              }
              this.props.selectTodo(this.state.selectedTodo, this.state.todoList, false);
            });
          } else { // 이미 선택 된 todo가 있을 경우 & 다른 todo를 선택
            this.setState({
              todoList: update( this.state.todoList, {
                [this.props.selectedTodo.index]: { "isSelected": { $set: false } },
                [index]: { "isSelected": { $set: true } }
              })
            }, () => {
              this.props.selectTodo(this.state.selectedTodo, this.state.todoList, true);
            });
          }
        } else { // 선택 된 todo가 없을 경우
          this.setState({
            todoList: update( this.state.todoList, {
              [index]: { "isSelected": { $set: true } }
            })
          }, () => {
            if(/MSIE \d|Trident.*rv:/.test(navigator.userAgent)) {
              document.getElementById("todo-detail-page").style.left = '0%';
              document.getElementById("todo-detail-page").classList.add("active");
            } else {
              document.getElementById("todo-detail-page").animate([
                { left: '-50%' },
                { left: '0%' }
              ], 100).addEventListener('finish', function() {
                document.getElementById("todo-detail-page").style.left = '0%';
                document.getElementById("todo-detail-page").classList.add("active");
              });
            }

            this.props.selectTodo(this.state.selectedTodo, this.state.todoList, true);
          });
        }
      });
    }
  }

  checkTodo(e) { // checkbox를 통해 todo의 완료 여부를 체크.
    this.state = { todoList: this.props.todoList, count: this.props.count };
    if (e.target.checked) {
      e.target.nextSibling.classList.add("active");
      this.setState({ count: this.state.count-1 });
    } else {
      e.target.nextSibling.classList.remove("active");
      this.setState({ count: this.state.count+1 });
    }
    this.setState({
      todoList: update(
        this.state.todoList, {
          [e.target.parentNode.className]: {
            "isCompleted": { $set: !(this.state.todoList[e.target.parentNode.className].isCompleted) }
          }
        }
      )
    }, () => {
      this.props.checkTodo(this.state.todoList, this.state.count);
    });
  }

  render() {
    return (
      <div className="Todo">
        <h2><span className="glyphicon glyphicon-th-list"></span> To do : {this.props.count}</h2>
        <ul id="todoList" onDragOver={this.dragOver} onDragEnter={this.dragEnter} >
          {this.props.todoList.map((todo, i) => {
            return (
              <li key={i}
                  className={i}
                  draggable="true"
                  onDragStart={this.dragStart}
                  onDragOver={this.dragOver}
                  onDragEnter={this.dragEnter}
                  onDragLeave={this.dragLeave}
                  onDrop={this.drop}
                  onClick={this.selectTodo.bind(this, i)}
                  onMouseOver={this.mouseOver.bind(this, i)}
                  onMouseOut={this.mouseOut.bind(this, i)}>
                <input type="checkbox" className="checkbox" checked={this.todoCheckboxActive(i)} onClick={this.checkTodo} />
                <span className={this.todoItemActive(i)}>{todo.item} </span>
                <span className="subtask-length"> (subtask: {todo.subtask.length})</span>
                <button id={this.closeButtonId(i)} className="delete-btn" onClick={this.removeItem.bind(this, i)}><span className="glyphicon glyphicon-remove"></span></button>
              </li>
            );
          })}
          <li className={this.props.todoList.length} id="hidden-field"
              onDragOver={this.dragOver}
              onDragEnter={this.dragEnter}
              onDragLeave={this.dragLeave}
              onDrop={this.drop}>
          </li>
        </ul>
      </div>
    );
  }
}

export default Todo;
