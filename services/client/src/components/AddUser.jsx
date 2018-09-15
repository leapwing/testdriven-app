import React from "react";

const AddUser = props => {
  return (
    <form onSubmit={event => props.addUser(event)}>
      <div className="field">
        <input
          type="text"
          name="username"
          className="input is-large"
          placeholder="Enter a username"
          required
          value={props.username}
          onChange={props.handleChange}
        />
      </div>
      <div className="field">
        <input
          type="email"
          name="email"
          className="input is-large"
          placeholder="Enter an email address"
          required
          value={props.email}
          onChange={props.handleChange}
        />
      </div>
      <input
        type="submit"
        value="Submit"
        className="button is-primary is-large is-fullwidth"
      />
    </form>
  );
};

export default AddUser;
