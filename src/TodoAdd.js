import React, { Component } from 'react'
import update from 'react-addons-update'

class TodoAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item: "",
      todoList: this.props.todoList,
      count: this.props.count
    };
    this.addClick = this.addClick.bind(this);
  }

  handleChange(e) {
    var nextStage = {};
    nextStage[e.target.name] = e.target.value;
    this.setState(nextStage);
  }

  addClick(e) {
    e.preventDefault();
    if (this.state.item.length !== 0) {
      let newState = update(this.props, {
        todoList: { $push: [{ "item": this.state.item, "isCompleted": false, "subtask": [], "isSelected": false }] }
      });
      this.setState(newState);
      this.setState({
        count: (this.props.count)+1,
        item: ""
      }, () => {
        this.props.onUpdate(this.state.todoList, this.state.count);
      });
    } else {
      alert("내용을 입력하세요");
    }
  }

  render() {
    return (
      <div className="TodoAdd">
        <form onSubmit={this.addClick}>
          <input type="text" name="item" placeholder="Add a to-do.." autoComplete="off"
                 value={this.state.item}
                 onChange={this.handleChange.bind(this)}
          />
        </form>
      </div>
    );
  }
}

export default TodoAdd;
