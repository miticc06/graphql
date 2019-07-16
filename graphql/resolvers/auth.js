const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = {
  createUser: async args => {
    try {
      let existingUser = await User.findOne({ email: args.userInput.email });
      if (existingUser) {
        throw new Error("User exists already.");
      }

      let hashedPassword = await bcrypt.hash(args.userInput.password, 12);
      const user = new User({
        email: args.userInput.email,
        password: hashedPassword
      });
      const result = await user.save();

      return {
        ...result._doc,
        password: null,
        _id: result.id
      };
    } catch (err) {
      throw err;
    }
  },
  login: async args => {
    try {
      const user = await User.findOne({ email: args.email });
      if (!user) {
        throw new Error("User not found.");
      }
      const isMatchPassword = await bcrypt.compare(
        args.password,
        user.password
      );

      if (!isMatchPassword) {
        throw new Error("Wrong password.");
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.SECRECT_KEY,
        {
          expiresIn: "1h"
        }
      );
      return {
        userId: user.id,
        token: token,
        tokenExpiration: 1
      };
    } catch (error) {
      throw error;
    }
  }
};
