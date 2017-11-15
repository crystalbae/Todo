import React, { Component } from 'react'
import update from 'react-addons-update'
import './css/TodoDetail.css'

class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTodo: null,
      todoList: null,
      item: "",
      title: "",
      changingStatus: true
    }
    this.subTaskClose = this.subTaskClose.bind(this); // todo의 detail창을 닫는다.
    this.changingTitle = this.changingTitle.bind(this); // todo title 변경을 위한 input이 active된다.
    this.changedTitle = this.changedTitle.bind(this); // todo title 변경사항을 업데이트한다.
    this.changingStart = this.changingStart.bind(this);
    this.changingCancel = this.changingCancel.bind(this);
    this.handleChange = this.handleChange.bind(this); // subtask의 input text가 변경될때 마다 실행된다.
    this.addClick = this.addClick.bind(this); // subtask를 추가한다.
    this.subtaskActive = this.subtaskActive.bind(this); // todo의 subtask가 있으면 list가 return된다.
  }

  subTaskClose(e) { // subtask창을 닫는다.
    this.setState({
      todoList: this.props.todoList
    }, () => {
      this.setState({
        selectedTodo: null,
        todoList: update( this.state.todoList, {
          [this.props.selectedTodo.index]: { "isSelected": { $set: false } }
        })
      }, () => {
        this.props.selectTodo(this.state.selectedTodo, this.state.todoList, false);

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
    });
  }

  changingTitle() {
    if (this.state.changingStatus) {
      document.getElementById("detail-title").classList.remove("active");
      document.getElementById("temporary-form").classList.add("active");
      document.getElementById("temporary-input").focus();
      this.setState({ title: this.props.selectedTodo.todo, changingStatus: false });
    }
  }

  changedTitle(e) {
    e.preventDefault();
    this.setState({
      selectedTodo: this.props.selectedTodo
    }, () => {
      this.setState({
        selectedTodo: update(
          this.state.selectedTodo, { "todo": { $set: this.state.title } }
        ),
        title: "",
        changingStatus: true
      }, () => {
        // console.log(this.state.selectedTodo);
        this.props.selectTodo(this.state.selectedTodo);
        this.props.updateTodoTitle(this.state.selectedTodo);
      });
    })
    document.getElementById("detail-title").classList.add("active");
    document.getElementById("temporary-form").classList.remove("active");
    document.getElementById("editDone-btn").classList.remove("active");
  }

  changingStart() {
    document.getElementById("editDone-btn").classList.add("active");
  }

  changingCancel() {
    setTimeout(function() {
      document.getElementById("detail-title").classList.add("active");
      document.getElementById("temporary-form").classList.remove("active");
      this.setState({ changingStatus: true });
    }.bind(this), 200);
  }

  detailTodoTitle() {
    let title = (this.props.selectedTodo !== null) ? this.props.selectedTodo.todo : null;
    return title
  }

  handleChange(e) {
    var nextStage = {};
    nextStage[e.target.name] = e.target.value;
    this.setState(nextStage);
  }

  addClick(e) { // todo의 subtask를 추가한다.
    e.preventDefault();
    if (this.state.item.length !== 0) {
      this.setState({
        todoList: this.props.todoList
      }, () => {
        let newState = update(this.state, {
          todoList: {
            [this.props.selectedTodo.index]: { subtask: {$push: [ this.state.item ]} }
          }
        });
        this.setState(newState);
        this.setState({ item: "" }, () => { this.props.onUpdate(this.state.todoList); });
      });
    } else {
      alert("내용을 입력하세요");
    }
  }

  removeSubtask(subtaskIndex) {
    let todoIndex = this.props.selectedTodo.index;
    // console.log("todoIndex: " + todoIndex + " , " + "subtaskIndex: " + subtaskIndex);
    this.setState({
      todoList: this.props.todoList
    }, () => {
      this.setState({
        todoList: update( this.state.todoList, {
          [todoIndex]: { subtask: {$splice: [[subtaskIndex, 1]]} }
        })
      }, () => {
        this.props.removeSubtask(this.state.todoList);
      });
    });

  }

  subtaskActive() {
    if (this.props.selectedTodo !== null) {
      return (
        <ul>
        {this.props.todoList[this.props.selectedTodo.index].subtask.map((subtask, i) => {
          return (
            <li key={i}>
              {subtask}
              <button className="delete-btn" onClick={this.removeSubtask.bind(this, i)}><span className="glyphicon glyphicon-remove"></span></button>
            </li>
          );
        })}
        </ul>
      );
    }
  }

  render() {
    return (
      <div className="Detail">
        <button className="close-btn" onClick={this.subTaskClose}>X</button>
        <h1 onClick={this.changingTitle} id="title">
          <span id="detail-title" className="active">
            <span className="glyphicon glyphicon-ok"></span>
            {this.detailTodoTitle()}
          </span>
          <form id="temporary-form" onSubmit={this.changedTitle}>
            <input type="text" id="temporary-input" name="title" autoComplete="off" autoFocus
                   value={this.state.title}
                   onChange={this.handleChange}
                   onBlur={this.changingCancel}
                   onKeyPress={this.changingStart}
                   />
            <input type="submit" id="editDone-btn" value="save" />
          </form>
        </h1>
        <h2>Subtasks</h2>
        <form onSubmit={this.addClick}>
          <input type="text" className="subtask" name="item" placeholder="Add a subtask.." autoComplete="off"
                 value={this.state.item}
                 onChange={this.handleChange} />
        </form>
        {this.subtaskActive()}
      </div>
    );
  }
}

export default Detail;
