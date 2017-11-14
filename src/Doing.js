import React, { Component } from 'react'
import './css/App.css'

class Doing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      todoList: this.props.todoList,
      doingList: this.props.doingList,
      count: this.props.count
    };
    this.dragStart = this.dragStart.bind(this);
    this.dragOver = this.dragOver.bind(this);
    this.dragLeave = this.dragLeave.bind(this);
    this.drop = this.drop.bind(this);
    this.dropEmpty = this.dropEmpty.bind(this);
  }

  closeButtonId(index) {
    return ("close-"+index);
  }

  dragStart(e) {
    this.props.dragStart(e);
  }

  dragOver(e) {
    this.props.dragOver(e);

  }

  dragLeave(e) {
    this.props.dragLeave(e);
  }

  drop(e) {
    this.props.drop(e);
  }

  dropEmpty(e) {
    this.props.dropEmpty(e);
  }

  render() {
    return (
      <div className="Doing w3-third">
        <h2>Doing</h2>
        <ul id="doingList" onDragOver={this.dragOver} onDrop={this.dropEmpty}>
          {this.props.doingList.map((doing, i) => {
            return (
              <li key={i}
                  id={i}
                  className={i}
                  draggable="true"
                  onDragStart={this.dragStart}
                  onDragOver={this.dragOver}
                  onDragLeave={this.dragLeave}
                  onDrop={this.drop}>
                <span>{doing.item}</span>
                <button id={this.closeButtonId(i)} className="delete-btn">x</button>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

export default Doing;
