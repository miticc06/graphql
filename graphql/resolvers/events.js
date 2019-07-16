const Event = require("../../models/event");
const { dateToString } = require("../../helper/date");
const { transformEvent } = require("./merge");
const User = require("../../models/user");

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map(event => {
        return transformEvent(event);
      });
    } catch (err) {
      throw err;
    }
  },
  createEvent: async args => {
    try {
      const event = new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: +args.eventInput.price,
        date: dateToString(args.eventInput.date),
        creator: "5d2bf5fe01428e051472663e"
      });

      const result = await event.save();

      let createEvent = transformEvent(result);

      const creator = await User.findById("5d2bf5fe01428e051472663e");
      if (!creator) {
        throw new Error("User not found");
      }
      creator.createdEvents.push(event);
      await creator.save();

      return createEvent;
    } catch (err) {
      throw err;
    }
  }
};
