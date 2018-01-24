import React, { Component } from 'react';
import './App.css';

const styles = {
  form: {
    display: 'flex',
    justifyContent: 'space-evenly',
    flexFlow: 'column',
    width: '100vw',
    padding: '10px'
  },

  margin: {
    marginBottom: '20px'
  },

  left: {
    float: 'left'
  },

  right: {
    float: 'right'
  },

  workItem: {
    display: 'block',
    clear: 'both'
  },

  borderBottom: {
    borderBottom: '2px solid black'
  },

  inputDescription: {
    width: '200px'
  },

  inputMinutes: {
    width: '50px'
  },

  inputButton: {
    padding: '5px 15px 5px 15px',
    marginLeft: '20px',
    border: '2px solid black'
  },

  label: {
    paddingRight: '15px',
    display: 'inline-block'

  },

  error: {
    color: 'red',
    marginLeft: '20px',
    display: 'inline'
  },

  workContiner: {
    width: '75%',
    height: '90%',
    border: '3px solid black',
    padding: '10px'
  }
}

const validateDescription = (description) => {
  return description.trim().length > 5;
}

const validateMinutes = (minutes) => {
  return (minutes >= 0 && minutes <= 240)
}

const getTimeFormat = (minutes) => {
  minutes = parseInt(minutes, 10);
  console.log(minutes);
  let h = Math.floor(minutes / 60);
  let m = minutes % 60;
  console.log(h + " : " +  m);
  //h = h < 10 ? '0' + h : h;
  m = m < 10 ? '0' + m : m;
  return h + ':' + m;
}

const resetState = (newWorkArray) => {
  return {project: 'personal', description: '', minutes: '', error: {description: '', minutes: ''}, disableForm: true, work: newWorkArray};
}


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      project: 'personal',
      description: '',
      minutes: '',

      error: {
        description: '',
        minutes: ''
      },

      disableForm: true,

      work: []
    };

    //Add binding of 'this' here
    this.handleInputDescription = this.handleInputDescription.bind(this);
    this.handleInputMinutes = this.handleInputMinutes.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.getWorkTypeSorted = this.getWorkTypeSorted.bind(this);
    this.getTotalMinutes = this.getTotalMinutes.bind(this);
  }

  handleInputDescription(e) {
    validateDescription(e.target.value) ? this.setState( {disableForm: !validateMinutes(this.state.minutes), description: e.target.value, error: {description: '', minutes: this.state.error.minutes}} ) :

      this.setState( {disableForm: true, description: e.target.value, error: {description: 'Description must be at least 5 characters', minutes: this.state.error.minutes}} );
  }

  handleInputMinutes(e) {
    validateMinutes(e.target.value) ?
      this.setState( {disableForm: !validateDescription(this.state.description), minutes: e.target.value, error: {description: this.state.error.description, minutes: ''}} ) :
      this.setState( {disableForm: true, minutes: e.target.value, error: {description: this.state.error.description, minutes: 'Must be must be 0, but no more than 240 minutes'}} );
  }

  handleSelectChange(e) {
    this.setState( {project: e.target.value});
  }

  handleClick(e) {
    e.preventDefault();
    let project = this.state.project, description = this.state.description, minutes = this.state.minutes;
    this.setState( resetState( this.state.work.concat([{project, description, minutes}]) ) );
  }

  getWorkTypeSorted( type ) {
    //Sorts in descending order
    const filterArray = this.state.work.filter( item => item.project === type);
    return filterArray.sort( (a, b) => {
      return (a.minutes < b.minutes);
    });
  }

  getTotalMinutes(workArray) {
    if( workArray.length > 0 ) {
      return workArray.map( item => item.minutes)
      .reduce( (currentValue, totalValue) =>  parseInt(currentValue, 10) + parseInt(totalValue, 10) );
     }
     else { return 0; }
  }

  render() {
    return (
      <div className="container">
        <header>
          <h1>Work Logger</h1>
        </header>
        <div style={styles.borderBottom} className="row">
          <form style={styles.form} onSubmit={this.handleClick}>

            <div style={styles.margin}>
              <label style={styles.label} htmlFor="workType">Project</label>
              <select onChange={this.handleSelectChange} value={this.state.project} name="workType">
                <option value="personal">Personal</option>
                <option value="work">Work</option>
              </select>
            </div>

            <div style={styles.margin}>
              <label style={styles.label} htmlFor="description">Description</label>
              <input type="text" name="description" onInput={this.handleInputDescription} style={styles.inputDescription} value={this.state.description} placeholder="Enter a Description" />
              <p style={styles.error}>{this.state.error.description}</p>
            </div>

            <div style={styles.margin}>
              <label style={styles.label} htmlFor="minutes">Minutes</label>
              <input type="number" name="minutes" onInput={this.handleInputMinutes} style={styles.inputMinutes} value={this.state.minutes} placeholder="30" />
              <p style={styles.error}>{this.state.error.minutes}</p>
            </div>

            <div style={styles.margin}>
              <button style={styles.inputButton} disabled={this.state.disableForm}>Add</button>
            </div>

          </form>
        </div>
        <div className="row">
          <div className="column">

            <div style={styles.workContiner}>
              <h2 style={styles.left}>Personal</h2><h3 style={styles.right}>{getTimeFormat( this.getTotalMinutes( this.getWorkTypeSorted('personal') ) )}</h3>
              {this.getWorkTypeSorted('personal').map( (item, index) => {
                return (
                  <div style={styles.workItem}>
                    <p key={index} style={{display: 'inline'}}>{getTimeFormat(item.minutes)}</p>
                    <p key={index} style={{color: 'red', display: 'inline-block', marginLeft: '40px'}}>{item.description}</p>
                  </div>
                );
              })}
            </div>

          </div>
          <div className="column">

            <div style={styles.workContiner}>
              <h2 style={styles.left}>Work</h2>
                {this.getWorkTypeSorted('work').map( (item, index) => {
                  return (<p key={index} style={styles.left}>{item.minutes} -- {item.description}</p>);
                })}

            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
