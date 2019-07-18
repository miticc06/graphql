import React, { Component } from "react";
import "./Events.css";
import AuthContext from "../context/auth-context";
import Modal from "../components/Modal/Modal";
import Backdrop from "../components/Backdrop/Backdrop";
import EventList from "../components/Events/EventList/EventList";
import Spinner from "../components/Spinner/Spinner";
class EventsPage extends Component {
  state = {
    creating: false,
    isLoading: false,
    events: []
  };

  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.titleElRef = React.createRef();
    this.descriptionElRef = React.createRef();
    this.dateElRef = React.createRef();
    this.priceElRef = React.createRef();
  }

  componentDidMount() {
    this.fetchEvents();
  }

  startCreateEventHandler = () => {
    this.setState({ creating: true });
  };

  cancelCreateEventHandler = () => {
    this.setState({ creating: false });
  };

  fetchEvents() {
    this.setState({ isLoading: true });

    const requestBody = {
      query: `
        query {
          events {
            _id
            title
            description
            price
            date
            creator {
              email
              _id
            }
          }
        }
      `
    };

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("failed!");
        }
        return res.json();
      })
      .then(resData => {
        const arrEvent = resData.data.events;
        this.setState({ events: arrEvent, isLoading: false });
      })
      .catch(err => {
        this.setState({ isLoading: false });
      });
  }

  confirmCreateEventHandler = () => {
    this.setState({ creating: false });

    const title = this.titleElRef.current.value;
    const description = this.descriptionElRef.current.value;
    const price = +this.priceElRef.current.value;
    const date = this.dateElRef.current.value;

    if (
      !title ||
      title.trim().length === 0 ||
      !description ||
      description.trim().length === 0 ||
      !price ||
      price < 0 ||
      !date ||
      date.trim().length === 0
    ) {
      return;
    }

    const requestBody = {
      query: `
      mutation {
        createEvent (eventInput : {
          title : "${title}",
          description : "${description}",
          price: ${price},
          date: "${date}"
        }) {
          title
          _id
          description
          price
          date
          creator {
            _id
            email
          }
        }
      }
      `
    };

    const token = this.context.token;

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "xxx " + token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("failed!");
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);

        this.setState(prevState => {
          const arrEvents = [...prevState.events];
          arrEvents.push({
            _id: resData.data.createEvent._id,
            title: resData.data.createEvent.title,
            description: resData.data.createEvent.description,
            price: resData.data.createEvent.price,
            date: resData.data.createEvent.date,
            creator: {
              _id: this.context.userId
            }
          });
          return { events: arrEvents };
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    return (
      <React.Fragment>
        {this.state.creating && <Backdrop />}
        {this.state.creating && (
          <Modal
            title="Add event"
            canCancel
            canConfirm
            onCancel={this.cancelCreateEventHandler}
            onConfirm={this.confirmCreateEventHandler}
          >
            <form>
              <div className="form-control">
                <label htmlFor="title">Title</label>
                <input id="title" type="text" ref={this.titleElRef} />
              </div>
              <div className="form-control">
                <label htmlFor="price">Price</label>
                <input id="price" type="number" ref={this.priceElRef} />
              </div>
              <div className="form-control">
                <label htmlFor="date">Date</label>
                <input id="date" type="datetime-local" ref={this.dateElRef} />
              </div>
              <div className="form-control">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  type="text"
                  rows="4"
                  ref={this.descriptionElRef}
                />
              </div>
            </form>
          </Modal>
        )}

        {this.context.token && (
          <div className="events-control">
            <p>Share your own Events!</p>
            <button className="btn" onClick={this.startCreateEventHandler}>
              Create Event
            </button>
          </div>
        )}

        {this.state.isLoading && <Spinner />}

        <EventList events={this.state.events} userId={this.context.userId} />
      </React.Fragment>
    );
  }
}
export default EventsPage;
