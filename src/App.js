import React, { Component } from 'react';
import './App.css';
import PubNubReact from 'pubnub-react';
import Modal from 'simple-react-modal';

class App extends Component {

  constructor(props){
    super(props);
    this.state = {show: false, gogo: false, clickable: false, opt: true, someoneElseClicking: false, someoneElseClicking2: false, name: "Honest John's", location: "Exchange Quay", grading: "Single site independent",name2: "Honest John's", location2: "Exchange Quay", grading2: "Single site independent"};
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
            publishKey: 'pub-c-2fc0e300-5eba-4039-be27-a80998ec053b',
            subscribeKey: 'sub-c-a62b3f12-ad2c-11e8-9990-cad020f6577b'
        });
        this.pubnub.init(this);
      }

  componentWillMount() {
    this.pubnub.subscribe({channels: ['channel', 'channel2', 'channel22', 'channel11'], withPresence: true, triggerEvents: true,});

    this.setState({
        id: 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        })


    });

    this.pubnub.getMessage('channel', (msg) => {
        if (msg.message.id !== this.state.id) this.setState({
          [msg.message.form]: msg.message.value
        });
    });

    this.pubnub.getMessage('channel11', (msg) => {
        if (msg.message.id !== this.state.id) {
          // which = `${msg.message.form}3`
          this.setState({
            [`${msg.message.form}3`]: msg.message.value
        });}
  });

    this.pubnub.getMessage('channel2', (msg) => {
      if (msg.message.id !== this.state.id) this.setState({
          someoneElseClicking: msg.message.clicking
      });
  });

  this.pubnub.getMessage('channel22', (msg) => {
    if (msg.message.id !== this.state.id) {
      if (msg.message.clicking){
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
  this.pubnub.unsubscribe({channels: ['channel', 'channel2', 'channel22', 'channel11']});
}
  render() {
    return (
      <div className="App">
        <header className="App-header">
        <div className="hbox">
          <img style={{maxWidth: "15vh", maxHeight: "15vh", margin: "0 auto"}} src="https://ivendi.com/media/1551/ivendi_logo_copy.jpg"/>
          <button className="optionbut" onClick={()=>this.handleClick('opt')}>Option 1</button>
          <button className="optionbut" onClick={()=>this.handleClick('pess')}>Option 2</button>
          <h1 style={{maxHeight: "20vh"}}>{this.state.opt ? "Option 1" : "Option 2"}</h1>

        </div>
        </header>
        {this.state.opt && <div>
          <button onClick={this.handleEdit}>{this.state.clickable ? "Submit" : "Edit"}</button>
          {this.state.someoneElseClicking && <div>
<p>Stop, someone else is editing this form</p>

          </div>}
          {!this.state.someoneElseClicking && <div>
          <p className="heads">Name</p>
                    <input disabled={!this.state.clickable} ref={this.inpRef1} onChange={e=>{this.handleInput(e, "name")}}/>
                 <span>{this.state.clickable ? "New Value:" : "Current Value:"} {this.state.name}</span>
                    <p className="heads">Location</p>
                    <input disabled={!this.state.clickable} ref={this.inpRef2} onChange={e=>{this.handleInput(e, "location")}}/>
                   <span>Current Value: {this.state.location}</span>
                    <p className="heads">Grading</p>
                    <input disabled={!this.state.clickable} ref={this.inpRef3} onChange={e=>{this.handleInput(e, "grading")}}/>
                   <span>Current Value: {this.state.grading}</span>

          </div>}
        </div>}
        {!this.state.opt && <div>
          <button onClick={this.handleEdit2}>{this.state.clickable ? "Submit" : "Edit"}</button>
          <p className="heads">Name</p>
                    <input disabled={!this.state.clickable} ref={this.inpRef12} onChange={e=>{this.handleInput2(e, "name2")}}/>
                 <span>{this.state.clickable ? "New Value:" : "Current Value:"} {this.state.name2}</span>
                    <p className="heads">Location</p>
                    <input disabled={!this.state.clickable} ref={this.inpRef22} onChange={e=>{this.handleInput2(e, "location2")}}/>
                   <span>{this.state.clickable ? "New Value:" : "Current Value:"} {this.state.location2}</span>
                    <p className="heads">Grading</p>
                    <input disabled={!this.state.clickable} ref={this.inpRef32} onChange={e=>{this.handleInput2(e, "grading2")}}/>
                   <span>{this.state.clickable ? "New Value:" : "Current Value:"} {this.state.grading2}</span>
                   {this.state.someoneElseClicking2 && <h1>
                     Warning, someone else is currently editing.
                   </h1>}

        </div>}
        {this.state.show && <Modal
                    show={this.state.show}
                    onClose={this.close}
                    closeOnOuterClick={true}>
                    <div>Someone has edited these details recently, please review those changes before submitting
                        <button onClick={this.toggleModal}>Close</button>
                    </div>
                </Modal>}
      </div>
    );
  }

  handleInput2(evt, form){
    this.pubnub.publish({channel: 'channel11', message: {id: this.state.id, form: form, value: evt.target.value}}, (response) => {
      console.log(response);
  });
  console.log(evt.target.value)
  this.setState({
      [form]: evt.target.value
  });
  }

  handleEdit2(){
    this.pubnub.publish({channel: 'channel22', message: {id: this.state.id, clicking: !this.state.clickable}}, (response) => {
      console.log(response);
  });
  
  this.inpRef12.current.value = "";
  this.inpRef22.current.value = "";
  this.inpRef32.current.value = "";

  if (this.state.gogo) {
    let {name23, location23, grading23} = this.state;
    if (!name23) name23 = "Honest John's"
    if (!location23) location23 = "Exchange Quay";
    if (!grading23) grading23 = "Single site independent";
    this.setState({
      name2: name23,
      location2: location23,
      grading2: grading23,
      show: true,
      clickable: !this.state.clickable
    })
  } else {
    this.setState({
      clickable: !this.state.clickable
  });
  }
  }

  handleEdit(){
    this.pubnub.publish({channel: 'channel2', message: {id: this.state.id, clicking: !this.state.clickable}}, (response) => {
      console.log(response);
  });
  this.inpRef1.current.value = "";
  this.inpRef2.current.value = "";
  this.inpRef3.current.value = "";

  this.setState({
      clickable: !this.state.clickable
  });
  }

  handleClick(which){
    if (which === 'opt') {
      this.setState({
        opt: true
      })
    } if (which === 'pess') {
      this.setState({
        opt: false,
        name2: this.state.name,
        location2: this.state.location,
        grading2: this.state.grading
      })
    }
  }

  handleInput(evt, form){
    this.pubnub.publish({channel: 'channel', message: {id: this.state.id, form: form, value: evt.target.value}}, (response) => {
        console.log(response);
    });
    console.log(evt.target.value)
    this.setState({
        [form]: evt.target.value
    });
}
toggleModal() {
  this.setState({
      show: !this.state.show
  })
}
}

export default App;