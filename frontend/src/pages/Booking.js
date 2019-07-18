import React, { Component } from "react";
import Spinner from "../components/Spinner/Spinner";
import AuthContext from "../context/auth-context";
import BookingList from "../components/Bookings/BookingList/BookingList";

class BookingPage extends Component {
  state = {
    isLoading: false,
    bookings: []
  };

  static contextType = AuthContext;

  // constructor(props) {
  //   super(props);
  // }

  componentDidMount() {
    this.fetchData();
  }

  deleteHandler = bookingId => {
    const requestBody = {
      query: `
      mutation {
        cancelBooking(bookingId : "${bookingId}") {
          _id
          title
          description
          price
          date
          creator {
            email
          }
        }
      }
      `
    };

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "xxx " + this.context.token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("failed!");
        }
        return res.json();
      })
      .then(resData => {
        const arrEvent = this.state.bookings.filter(
          booking => booking._id !== bookingId
        );
        this.setState({ bookings: arrEvent, isLoading: false });
      })
      .catch(err => {
        this.setState({ isLoading: false });
      });
  };

  fetchData() {
    this.setState({ isLoading: true });
    // console.log(this.context.token);
    const requestBody = {
      query: `
      {
        bookings {
          _id
          event {
            title
          }
          user {
            email
          }
          createdAt
          updatedAt
        }
      } 
      `
    };

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "xxx " + this.context.token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("failed!");
        }
        return res.json();
      })
      .then(resData => {
        const arrBooking = resData.data.bookings;
        this.setState({ bookings: arrBooking, isLoading: false });
      })
      .catch(err => {
        this.setState({ isLoading: false });
      });
  }

  render() {
    return (
      <React.Fragment>
        {this.state.isLoading && <Spinner />}
        <BookingList
          bookings={this.state.bookings}
          onDelete={this.deleteHandler}
        />
      </React.Fragment>
    );
  }
}

/*


        <ul>
          {this.state.bookings.map(booking => (
            <li key={booking._id}>
              {booking.event.title} - {booking.user.email} -{" "}
              {new Date(booking.createdAt).toLocaleDateString()}
            </li>
          ))}
        </ul>

*/

export default BookingPage;
