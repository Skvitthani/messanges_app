const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const connectDb = require("./config/dbConnection");
// const multer = require("multer");

const dotenv = require("dotenv").config();

const User = require("./models/user");
const Message = require("./models/message");
const app = express();
const port = 3000;
const cors = require("cors");
app.use(cors());

const http = require("http").Server(app);

const socketIO = require("socket.io")(http, {
  cors: {
    origin: "http://192.168.24.107:3000",
  },
});

socketIO.on("connection", async (socket) => {
  socket.on("newChat", async (obj) => {
    const { senderId, recepientId } = obj;
    const messages = await Message.find({
      $or: [
        { senderId: senderId, recepientId: recepientId },
        { senderId: recepientId, recepientId: senderId },
      ],
    }).populate("senderId", "_id, name");
    socket.broadcast.emit("loadNewchat", messages);
  });
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
const jwt = require("jsonwebtoken");

connectDb();

http.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

//End point for Register User
app.post("/register", async (req, res) => {
  const { name, email, password, image, fcmToken } = req.body;

  const getUser = await User.findOne({ email });
  if (getUser) {
    res.json({ message: "Email already exist" });
  } else {
    //Create a new user object
    const newUser = User({
      name,
      email,
      password,
      image,
      is_online: null,
      fcmToken,
    });

    //save user to database
    newUser
      .save()
      .then(() => {
        res.status(200).json({ message: "User Entered Sucessfully" });
      })
      .catch((err) => {
        res.status(500).json({ message: "Error regestring user!" });
      });
  }
});

// Function for create user token
const createToken = (userId) => {
  const payload = {
    userId: userId,
  };

  const token = jwt.sign(payload, "Q$r2K6W8n!jCW%Zk", { expiresIn: "1h" });
  return token;
};

// endpoint for login perticular user
app.post("/login", (req, res) => {
  const { email, password, fcmToken } = req.body;
  console.log("fcmToken", fcmToken);
  if (!email || !password) {
    return res.status(404).json({ message: "Email and password required" });
  }

  //   Check user available or not
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not Found" });
      }

      if (user.password !== password) {
        return res.status(404).json({ message: "Invalid password" });
      }
      user.fcmToken = fcmToken;
      user
        .save()
        .then((res) => {
          console.log("res:::", res);
        })
        .catch((err) => {
          console.log("err :::", err);
        });

      const token = createToken(user._id);

      res.status(200).json({ user: user, token: token });
    })
    .catch((error) => {
      console.log("error on  in finding the user", error);
      res.status(500).json({ message: "Internal server error" });
    });
});

//  endponit to access all the users except logged user
app.get("/users", (req, res) => {
  const id = req.query.userId;

  User.find({ _id: { $ne: id } })
    .then((Users) => {
      res.status(200).json(Users);
    })
    .catch((error) => {
      console.log("error on get all user dat api", error);
      res.status(500).json({ message: "Error Fetching User" });
    });
});

// endpoint to send request to user
app.post("/friend-request", async (req, res) => {
  const { currentUserId, selectedUserId } = req.body;
  try {
    // update the receiver's friend request array
    await User.findByIdAndUpdate(selectedUserId, {
      $push: { friendRequests: currentUserId },
    });

    // update the sender's friend request array
    await User.findByIdAndUpdate(currentUserId, {
      $push: { sendFriendRequest: selectedUserId },
    });
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
});

//  endpoint to show all friend request
app.get("/get-friend-request", async (req, res) => {
  const id = req.query.userId;
  try {
    const user = await User.findById(id)
      .populate("friendRequests", "name email image")
      .lean();
    const friendRequest = user.friendRequests;
    res.json(friendRequest);
  } catch (error) {
    console.log("error on show all friend request", error);
    return res.status(500).json({ message: error.message });
  }
});

app.post("/friend-request-accept", async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;

    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    sender.friends.push(receiver);
    receiver.friends.push(sender);

    sender.sendFriendRequest = sender.sendFriendRequest.filter(
      (res) => res?.toString() !== receiverId?.toString()
    );
    receiver.friendRequests = receiver.friendRequests.filter(
      (res) => res?.toString() !== senderId?.toString()
    );

    await sender.save();
    await receiver.save();

    res.status(200).json({ message: "Friend request accepted sucessfully." });
  } catch (error) {
    console.log("error on accept friend api", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// endpoint to get all user's friends
app.get("/accepted-friend-request", async (req, res) => {
  const id = req.query.userId;
  try {
    const user = await User.findById(id)
      .populate("friends", "name email image is_online")
      .lean();
    const friendRequest = user.friends;
    res.json(friendRequest);
  } catch (error) {
    console.log("error on get all user friend api", error);
    return res.status(500).json({ message: error.message });
  }
});

const multer = require("multer");

// Configure multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "files/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

//endpoint to post Messages and store it in the backend
app.post("/messages", upload.single("imageFile"), async (req, res) => {
  try {
    const { senderId, recepientId, messageType, messageText } = req.body;

    const newMessage = new Message({
      senderId,
      recepientId,
      messageType,
      message: messageText,
      timestamp: new Date(),
      imageUrl: messageType === "image" ? req.file.path : null,
    });

    await newMessage.save();
    res.status(200).json(newMessage);
  } catch (error) {
    console.log("error on message api", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// endponit to access message Receiver
app.get("/user", async (req, res) => {
  try {
    const id = req.query.userId;
    const recepientId = await User.findById(id);
    res.json(recepientId);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// endpoint to fetch all message between two users
app.get("/get-messages", async (req, res) => {
  try {
    const senderId = req.query.senderId;
    const recepientId = req.query.recepientId;

    const messages = await Message.find({
      $or: [
        { senderId: senderId, recepientId: recepientId },
        { senderId: recepientId, recepientId: senderId },
      ],
    }).populate("senderId", "_id, name");
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// endpoint for delete message
app.post("/delete-messages", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(404).json({ message: "Invalid req body" });
    }

    await Message.deleteMany({ _id: { $in: messages } });

    res.status(200).json({ message: "Messages deleted successfully" });
  } catch (error) {
    console.log("error on delete message api", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/friend-request/sent", async (req, res) => {
  try {
    const id = req.query.userId;
    console.log("id", id);

    const user = await User.findById(id)
      .populate("sendFriendRequest", "name email image")
      .lean();
    console.log("user", user);
    if (user !== null) {
      const sendFriendRequest = user.sendFriendRequest;
      console.log("sendFriendRequest", sendFriendRequest);
      res.json(sendFriendRequest);
    }
  } catch (error) {
    console.log("error on get sent friend request", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/friends", (req, res) => {
  try {
    const id = req.query.userId;

    User.findById(id)
      .populate("friends")
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        const friendIds = user.friends.map((friend) => friend._id);

        res.status(200).json(friendIds);
      });
  } catch (error) {
    console.log("error on get friend", error);
    res.status(500).json({ message: "internal server error" });
  }
});
