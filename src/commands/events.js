let mongoose = require("mongoose");
const eventSchema = require("../schema/event");
const config = require("../config");

const eventAddCommand = (name, date, link, message) => {
  mongoose.connect(config.url, { useNewUrlParser: true });

  let db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", function() {
    console.log("Successfully connected to MongoDB.");
    let NewEvent = mongoose.model("NewEvents", eventSchema);
    let newDate = new Date(date);
    let newEvent = new NewEvent({
      title: name,
      date: newDate,
      url: link,
      type: "Events"
    });
    console.log(newEvent);
    newEvent.save();
  });
  message.channel.send(`Added ${name} event to the Database. 👌`);
};

const eventHelpCommand = recievedMessage => {
  recievedMessage.channel.send(
    `Event Commands:
    !event add eventName MM/DD/YYYY eventURL - Adds an event to the database.
    !event showAll - Shows all events that are in the database.`
  );
};

async function eventShowAllCommand(recievedMessage) {
  mongoose.connect(config.url, { useNewUrlParser: true });

  let db = mongoose.connection;
  console.log("DB Made");
  db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", function() {
    console.log("Successfully connected to MongoDB.");
    let NewEvent = mongoose.model("NewEvents", eventSchema);
    NewEvent.find({}, (err, events) => {
      console.log(events);
      for (let event of events) {
        let todayDate = new Date();

        if (event.date.getTime() > todayDate.getTime()) {
          recievedMessage.channel.send(`
          Event Title: ${event.title}
          Event Date: ${event.date}
          Event URL: ${event.url}`);
        } else {
          NewEvent.findOneAndDelete(event, (error, data) => {
            if (error) {
              console.log("Deletion Error");
              throw error;
            } else {
              console.log(`Deleted ${event.name} event`);
            }
          });
        }
      }
    });
  });
}

module.exports.eventAddCommand = eventAddCommand;
module.exports.eventShowAllCommand = eventShowAllCommand;
module.exports.eventHelpCommand = eventHelpCommand;
