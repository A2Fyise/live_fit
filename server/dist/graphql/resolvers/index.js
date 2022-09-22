"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = require('bcrypt');
const { ApolloError } = require('apollo-server-express');
const saltRounds = process.env.SALT_ROUNDS;
const exercises = require('../../Data/exercises.json');
const User = require('../../models/user');
const Workouts = require('../../models/workouts');
const axios = require('axios');
const resolvers = {
    Query: {
        getUser: () => User.find(),
    },
    Mutation: {
        async addUser(_, args) {
            const { name, pass } = args;
            try {
                const salt = await bcrypt.genSalt(saltRounds);
                const hash = await bcrypt.hash(pass, salt);
                const user = new User({
                    user: name,
                    pass: hash,
                });
                const userExists = await User.findOne({ user: user.user });
                if (!userExists) {
                    await user.save();
                }
                return user;
            }
            catch (err) {
                console.log(err);
            }
        },
        async loginUser(parent, args) {
            const { name, pass } = args;
            const userExists = await User.findOne({ user: name });
            if (userExists) {
                const passCompare = await bcrypt.compare(pass, userExists.pass);
                if (passCompare) {
                    return userExists;
                }
                else {
                    return new ApolloError('Password do not match');
                }
            }
            else {
                return new ApolloError("User doesn't exist");
            }
        },
        async getExercise(_, { target }) {
            try {
                const { chest, back, legs, shoulders, arms } = exercises;
                switch (target) {
                    case 'chest':
                        return chest;
                    case 'back':
                        return back;
                    case 'legs':
                        return legs;
                    case 'shoulders':
                        return shoulders;
                    case 'arms':
                        return arms;
                    default:
                        return null;
                }
            }
            catch (err) {
                console.log(err);
            }
        },
        async createUpdateWorkout(_, { userName, workoutName, exercises }) {
            try {
                const user = await User.findOne({ user: userName });
                if (user) {
                    const workoutFound = await Workouts.findOne({ workoutName });
                    if (workoutFound) {
                        exercises.forEach((exercise) => {
                            workoutFound.exercises.push(exercise);
                        });
                        const found = await workoutFound.save();
                        console.log(found);
                        const result = await Workouts.find({ userName });
                        return result;
                    }
                    else {
                        const workouts = new Workouts({
                            userName,
                            workoutName,
                            exercises,
                        });
                        await workouts.save();
                        const result = await Workouts.find({ userName });
                        return result;
                    }
                }
                else {
                    return new ApolloError('User not found');
                }
            }
            catch (err) {
                console.log(err);
            }
        },
        async getUserWorkouts(_, { userName }) {
            try {
                const user = await User.findOne({ user: userName });
                if (!user)
                    return new ApolloError('Invalid User');
                const workoutsFound = await Workouts.find({ userName });
                return workoutsFound;
            }
            catch (err) {
                console.log(err);
            }
        },
        async getUserWorkout(_, { workoutName, userName }) {
            try {
                const user = await User.findOne({ user: userName });
                if (!user)
                    return new ApolloError('Invalid User');
                const workoutsFound = await Workouts.find({ workoutName });
                if (workoutsFound)
                    return workoutsFound;
            }
            catch (err) {
                console.log(err);
            }
        },
        async addSetsReps(_, { workoutName, userName, exerciseName, setsReps }) {
            try {
                const user = await User.findOne({ user: userName });
                if (user) {
                    const workoutFound = await Workouts.findOne({ workoutName });
                    if (workoutFound) {
                        workoutFound.exercises.forEach(async (item) => {
                            if (item.name === exerciseName) {
                                setsReps.forEach((elem) => {
                                    item.sets.push(elem);
                                });
                                await workoutFound.save();
                            }
                        });
                        return workoutFound;
                    }
                }
            }
            catch (err) {
                console.log(err);
            }
        },
        async deleteSet(_, { workoutName, userName, id }) {
            try {
                const user = await User.findOne({ user: userName });
                if (user) {
                    const workoutFound = await Workouts.findOne({ workoutName });
                    if (!workoutFound)
                        return new ApolloError('Invalid workout name');
                    workoutFound.exercises.forEach(async (item) => {
                        item.sets.forEach(async (set) => {
                            if (set.id === id) {
                                await set.remove();
                            }
                        });
                    });
                    await workoutFound.save();
                    return workoutFound;
                }
            }
            catch (err) {
                console.log(err);
            }
        },
        async updateSet(_, { workoutName, userName, id, reps, weight }) {
            try {
                const user = await User.findOne({ user: userName });
                if (user) {
                    const workoutFound = await Workouts.findOne({ workoutName });
                    if (!workoutFound)
                        return new ApolloError('Invalid workout name');
                    workoutFound.exercises.forEach(async (item) => {
                        item.sets.forEach(async (set) => {
                            if (set.id === id) {
                                set.$set({
                                    reps,
                                    weight,
                                });
                                // console.log(set)
                            }
                        });
                    });
                    await workoutFound.save();
                    return workoutFound;
                }
            }
            catch (err) {
                console.log(err);
            }
        },
        async getFoodCalories(_, { query }) {
            try {
                const res = await axios.get(`https://api.calorieninjas.com/v1/nutrition?query=${query}`, {
                    headers: {
                        'X-Api-Key': 'LUqUEvZwtBGEm9YqPvcb5g==rwCrBFMK8LHjYWQI',
                    },
                });
                return res.data.items;
            }
            catch (err) {
                console.log(err);
            }
        },
    },
};
module.exports = resolvers;
//# sourceMappingURL=index.js.map