import logo from "./logo.svg";
import React from "react";
import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      todoList: [],
      activeItem: {
        id: null,
        title: "",
        completed: false,
      },
      editing: false,
    };
    this.fetchTasks = this.fetchTasks.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getCookie = this.getCookie.bind(this);
    this.startEdit = this.startEdit.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.stikeUnstrike = this.stikeUnstrike.bind(this);
  }

  getCookie(name) {
    var cookievalue = null;
    if (document.cookie && document.cookie !== "") {
      var cookies = document.cookie.split(";");
      for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookievalue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookievalue;
  }

  componentWillMount() {
    this.fetchTasks();
  }

  fetchTasks() {
    console.log("Fetching...");
    fetch("http://127.0.0.1:8000/api/task-list/")
      .then((response) => {
        return response.json();
      })
      .then((data) =>
        this.setState({
          todoList: data,
        })
      );
  }

  handleChange(e) {
    var name = e.target.name;
    var value = e.target.value;
    console.log("Name:", name);
    console.log("Value:", value);

    this.setState({
      activeItem: {
        ...this.state.activeItem,
        title: value,
      },
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    console.log("ITEM:", this.state.activeItem);

    var csrftoken = this.getCookie("csrftoken");

    var url = "http://127.0.0.1:8000/api/task-create/";

    if (this.state.editing == true) {
      url = `http://127.0.0.1:8000/api/task-update/${this.state.activeItem.id}`;
      this.setState({
        editing: false,
      });
    }

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify(this.state.activeItem),
    })
      .then((response) => {
        this.fetchTasks();
        this.setState({
          activeItem: {
            id: null,
            title: "",
            completed: false,
          },
        });
      })
      .catch((error) => {
        console.log("ERROR:", error);
      });
  }

  startEdit(task) {
    this.setState({
      activeItem: task,
      editing: true,
    });
  }

  deleteItem(task) {
    var csrftoken = this.getCookie("csrfToken");
    fetch(`http://127.0.0.1:8000/api/task-delete/${task.id}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
      },
    }).then((response) => {
      this.fetchTasks();
    });
  }

  stikeUnstrike(task) {
    task.completed = !task.completed;
    var csrfToken = this.getCookie("csrfToken");
    var url = `http://127.0.0.1:8000/api/task-update/${task.id}`;

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
      body: JSON.stringify({
        completed: task.completed,
        title: task.title,
      }),
    }).then(() => {
      this.fetchTasks();
    });
  }

  render() {
    var tasks = this.state.todoList;
    var self = this;
    return (
      <>
        <div className="container">
          <div id="task-container">
            <div className="heading-container">
              <p>My Todos</p>
            </div>
            <div id="form-wrapper">
              <form onSubmit={this.handleSubmit} id="form">
                <div className="flex-wrapper">
                  <div style={{ flex: 6 }}>
                    <input
                      onChange={this.handleChange}
                      className="form-control"
                      id="title"
                      type="text"
                      name="title"
                      value={this.state.activeItem.title}
                      placeholder="Add task.."
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <input
                      id="submit"
                      className="btn btn-warning"
                      type="submit"
                    />
                  </div>
                </div>
              </form>
            </div>
            <div id="list-wrapper">
              {tasks.map(function (task, index) {
                return (
                  <div key={index} className="task-wrapper flex-wrapper">
                    <div
                      onClick={() => self.stikeUnstrike(task)}
                      style={{ flex: 5 }}
                    >
                      {task.completed == false ? (
                        <span>{task.title}</span>
                      ) : (
                        <strike>{task.title}</strike>
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <button
                        onClick={() => self.startEdit(task)}
                        className="btn btn-sm btn-outline-dark"
                      >
                        <i class="bx bxs-edit-alt"></i>Edit
                      </button>
                    </div>
                    <div style={{ flex: 1 }}>
                      <button
                        onClick={() => self.deleteItem(task)}
                        className="btn btn-sm btn-outline-dark delete"
                      >
                        <i class="bx bxs-message-alt-x"></i>Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default App;
