import React, { Component } from "react";
import "./App.css";
import PubNubReact from "pubnub-react";
import Modal from "simple-react-modal";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      gogo: false,
      clickable: false,
      opt: true,
      someoneElseClicking: false,
      someoneElseClicking2: false,
      name: "Honest John's",
      location: "Clippers Quay",
      grading: "Single site independent",
      name2: "Honest John's",
      location2: "Clippers Quay",
      grading2: "Single site independent"
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.handleInput2 = this.handleInput2.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleEdit2 = this.handleEdit2.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.inpRef1 = React.createRef();
    this.inpRef2 = React.createRef();
    this.inpRef3 = React.createRef();
    this.inpRef12 = React.createRef();
    this.inpRef22 = React.createRef();
    this.inpRef32 = React.createRef();
    this.pubnub = new PubNubReact({
      publishKey: "pub-c-2fc0e300-5eba-4039-be27-a80998ec053b",
      subscribeKey: "sub-c-a62b3f12-ad2c-11e8-9990-cad020f6577b"
    });
    this.pubnub.init(this);
  }

  componentWillMount() {
    this.pubnub.subscribe({
      channels: ["channel", "channel2", "channel22", "channel11"],
      withPresence: true,
      triggerEvents: true
    });

    this.setState({
      id: "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
        var r = (Math.random() * 16) | 0,
          v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      })
    });

    this.pubnub.getMessage("channel", msg => {
      if (msg.message.id !== this.state.id)
        this.setState({
          [msg.message.form]: msg.message.value
        });
    });

    this.pubnub.getMessage("channel11", msg => {
      if (msg.message.id !== this.state.id) {
        // which = `${msg.message.form}3`
        this.setState({
          [`${msg.message.form}3`]: msg.message.value
        });
      }
    });

    this.pubnub.getMessage("channel2", msg => {
      if (msg.message.id !== this.state.id)
        this.setState({
          someoneElseClicking: msg.message.clicking
        });
    });

    this.pubnub.getMessage("channel22", msg => {
      if (msg.message.id !== this.state.id) {
        if (msg.message.clicking) {
          this.setState({
            someoneElseClicking2: msg.message.clicking
          });
        } else {
          this.setState({
            someoneElseClicking2: msg.message.clicking,
            gogo: true
          });
        }
      }
    });
  }

  componentWillUnmount() {
    this.pubnub.unsubscribe({
      channels: ["channel", "channel2", "channel22", "channel11"]
    });
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div className="hbox">
            <img
              style={{ maxWidth: "15vh", maxHeight: "15vh", margin: "0 auto" }}
              src="https://ivendi.com/media/1551/ivendi_logo_copy.jpg"
            />
            <div
              className={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center"
              }}
            >
              {/* <button
                className="optionbut"
                onClick={() => this.handleClick("opt")}
              >
                <div />
                Option 1
              </button>
              <button
                className="optionbut"
                onClick={() => this.handleClick("pess")}
              >
                Option 2
              </button> */}
              <Button
                variant="outlined"
                color="primary"
                style={{
                  backgroundColor: this.state.opt === true ? "#303f9f" : "white",
                color: this.state.opt === false ? "#303f9f" : "white"}
                }
                // className={classes.button}
                onClick={() => this.handleClick("opt")}
              >
                Pessimistic
              </Button>
              <Button
                variant="outlined"
                color="primary"
                style={{
                  backgroundColor: this.state.opt === true ? "white" : "#303f9f",
                  color: this.state.opt === true ? "#303f9f" : "white"}
                }
                // className={classes.button}
                onClick={() => this.handleClick("pess")}
              >
                Optimistic
              </Button>

              <h1
                style={{
                  maxHeight: "20vh",
                  color: "black"
                }}
              >
                {/* {this.state.opt ? "Pessimistic" : "Optimistic"} */}
              </h1>
            </div>
          </div>
        </header>
        {this.state.opt && (
          <div>
            {/* <button onClick={this.handleEdit}>
              {this.state.clickable ? "Submit" : "Edit"}
            </button> */}
            <Button
              variant="contained"
              color="primary"
              // className={classes.button}
              onClick={this.handleEdit}
            >
              {this.state.clickable ? "Submit" : "Edit"}
            </Button>
            {this.state.someoneElseClicking && (
              <div>
                <p>Someone else is editing this form, please try again later.</p>
              </div>
            )}
            {!this.state.someoneElseClicking && (
              <div>
                <div
                  styles={{
                    display: "flex",
                    borderRadius: "10px",
                    borderWidth: "2px"
                  }}
                >
                  <p className="heads">Name</p>
                  <input
                    className="input-field"
                    borderRadius="10px"
                    disabled={!this.state.clickable}
                    ref={this.inpRef1}
                    onChange={e => {
                      this.handleInput(e, "name");
                    }}
                  />
                </div>
                <span>
                  {this.state.clickable ? "New Value:" : "Current Value:"}{" "}
                  {this.state.name}
                </span>
                <div styles={{ display: "flex" }}>
                  <p className="heads">Location</p>
                  <input
                    className="input-field"
                    disabled={!this.state.clickable}
                    ref={this.inpRef2}
                    onChange={e => {
                      this.handleInput(e, "location");
                    }}
                  />
                </div>
                <span>
                  {this.state.clickable ? "New Value:" : "Current Value:"}{" "}
                  {this.state.location}
                </span>

                <div styles={{ display: "flex" }}>
                  <p className="heads">Grading</p>
                  {/* <input
                    className="input-field"
                    disabled={!this.state.clickable}
                    ref={this.inpRef3}
                    onChange={e => {
                      this.handleInput(e, "grading");
                    }}
                  /> */}
                  <select disabled={!this.state.clickable} value={this.state.grading}  ref={this.inpRef3}
                    onChange={e => {
                      this.handleInput(e, "grading");
                    }}>
  <option value="Single site independent">Single site independent</option>
  <option value="Part of multi-site independent">Part of multi-site independent</option>
  <option value="Car supermarket independent">Car supermarket independent</option>
  <option value="Franchised single owner">Franchised single owner</option>
  <option value="Franchised group">Franchised group</option>
  <option value="Brand-owned site">Brand-owned site</option>
</select>
                </div>
                {/* <span>
                  {this.state.clickable ? "New Value:" : "Current Value:"}{" "}
                  {this.state.grading}
                </span> */}
              </div>
            )}
          </div>
        )}
        {!this.state.opt && (
          <div>
            {/* <button onClick={this.handleEdit2}>
              {this.state.clickable ? "Submit" : "Edit"}
            </button> */}
            <Button
              variant="contained"
              color="primary"
              // className={classes.button}
              onClick={this.handleEdit2}
            >
              {this.state.clickable ? "Submit" : "Edit"}
            </Button>
            <p className="heads">Name</p>
            <div styles={{ display: "flex" }}>
              <input
                className="input-field"
                disabled={!this.state.clickable}
                ref={this.inpRef12}
                onChange={e => {
                  this.handleInput2(e, "name2");
                }}
              />
            </div>
            <span>
              {this.state.clickable ? "New Value:" : "Current Value:"}{" "}
              {this.state.name2}
            </span>
            <p className="heads">Location</p>
            <div styles={{ display: "flex" }}>
              <input
                className="input-field"
                disabled={!this.state.clickable}
                ref={this.inpRef22}
                onChange={e => {
                  this.handleInput2(e, "location2");
                }}
              />
            </div>
            <span>
              {this.state.clickable ? "New Value:" : "Current Value:"}{" "}
              {this.state.location2}
            </span>
            <p className="heads">Grading</p>
            <div styles={{ display: "flex" }}>
              {/* <input
                className="input-field"
                disabled={!this.state.clickable}
                ref={this.inpRef32}
                onChange={e => {
                  this.handleInput2(e, "grading2");
                }}
              /> */}
              <select disabled={!this.state.clickable} value={this.state.grading2}  ref={this.inpRef32}
                    onChange={e => {
                      this.handleInput2(e, "grading2");
                    }}>
  <option value="Single site independent">Single site independent</option>
  <option value="Part of multi-site independent">Part of multi-site independent</option>
  <option value="Car supermarket independent">Car supermarket independent</option>
  <option value="Franchised single owner">Franchised single owner</option>
  <option value="Franchised group">Franchised group</option>
  <option value="Brand-owned site">Brand-owned site</option>
</select>
            </div>
            {/* <span>
              {this.state.clickable ? "New Value:" : "Current Value:"}{" "}
              {this.state.grading2}
            </span> */}
            {this.state.someoneElseClicking2 && (
              <h1>Warning, someone else is currently editing.</h1>
            )}
          </div>
        )}
        {this.state.show && (
          <Modal
          style={{margin: "0 auto", maxHeight: "40vh", maxWidth: "60vh", paddingTop: "100px"}}
            show={this.state.show}
            onClose={this.close}
            closeOnOuterClick={true}
          >
            <div style={{display: "flex", flexFlow: "column nowrap", maxWidth: "100%", maxHeight: "100%"}}>
              <p style={{maxHeight: "60%", maxWidth: "100%"}}>
              Someone has edited these details recently, please review those
              changes before submitting.
                </p>
              <button style={{border: "2px solid black", borderRadius: "8px", margin: "0 auto", maxHeight: "20", maxWidth: "60%"}} onClick={this.toggleModal}>Close</button>
            </div>
          </Modal>
        )}
      </div>
    );
  }

  handleInput2(evt, form) {
    this.pubnub.publish(
      {
        channel: "channel11",
        message: { id: this.state.id, form: form, value: evt.target.value }
      },
      response => {
        console.log(response);
      }
    );
    console.log(evt.target.value);
    this.setState({
      [form]: evt.target.value
    });
  }

  handleEdit2() {
    this.pubnub.publish(
      {
        channel: "channel22",
        message: { id: this.state.id, clicking: !this.state.clickable }
      },
      response => {
        console.log(response);
      }
    );

    this.inpRef12.current.value = "";
    this.inpRef22.current.value = "";
    this.inpRef32.current.value = "";

    if (this.state.gogo) {
      let { name23, location23, grading23 } = this.state;
      if (!name23) name23 = "Honest John's";
      if (!location23) location23 = "Clippers Quay";
      if (!grading23) grading23 = "Single site independent";
      this.setState({
        name2: name23,
        location2: location23,
        grading2: grading23,
        show: true,
        clickable: !this.state.clickable
      });
    } else {
      this.setState({
        clickable: !this.state.clickable
      });
    }
  }

  handleEdit() {
    this.pubnub.publish(
      {
        channel: "channel2",
        message: { id: this.state.id, clicking: !this.state.clickable }
      },
      response => {
        console.log(response);
      }
    );
    this.inpRef1.current.value = "";
    this.inpRef2.current.value = "";
    this.inpRef3.current.value = "";

    this.setState({
      clickable: !this.state.clickable
    });
  }

  handleClick(which) {
    if (which === "opt") {
      this.setState({
        opt: true
      });
    }
    if (which === "pess") {
      this.setState({
        opt: false,
        name2: this.state.name,
        location2: this.state.location,
        grading2: this.state.grading
      });
    }
  }

  handleInput(evt, form) {
    this.pubnub.publish(
      {
        channel: "channel",
        message: { id: this.state.id, form: form, value: evt.target.value }
      },
      response => {
        console.log(response);
      }
    );
    console.log(evt.target.value);
    this.setState({
      [form]: evt.target.value
    });
  }
  toggleModal() {
    this.setState({
      show: !this.state.show,
      gogo: false
    });
  }
}

export default App;
