const mongoose = require("mongoose");

const technicalQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, "Question is required"]
    },

    intention: {
        type: String,
        required: [true, "Intention is required"]
    },

    answer: {
        type: String,
        required: [true, "Answer is required"]
    },

    difficulty: {
        type: String,
        enum: ["easy", "medium", "hard"]
    }

}, {
    _id: false
});

const behavioralQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, "Question is required"]
    },

    intention: {
        type: String,
        required: [true, "Intention is required"]
    },

    answer: {
        type: String,
        required: [true, "Answer is required"]
    },

    difficulty: {
        type: String,
        enum: ["easy", "medium", "hard"]
    }

}, {
    _id: false
});

const skillGapSchema = new mongoose.Schema({
    skill: {
        type: String,
        required: [true, "Skill is required"]
    },

    severity: {
        type: String,
        enum: ["low", "medium", "high"],
        required: [true, "Severity is required"]
    },

    type: {
        type: String
    }

}, {
    _id: false
});

const preparationPlanSchema = new mongoose.Schema({
    day: {
        type: Number,
        required: [true, "Day is required"]
    },

    focus: {
        type: String,
        required: [true, "Focus is required"]
    },

    tasks: [{
        type: String,
        required: [true, "Task is required"]
    }]

}, {
    _id: false
});

const reportSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users", // change only if your actual user model is different
        required: true
    },

    jobDescription: {
        type: String,
        required: [true, "Job description is required"]
    },

    resumeText: {
        type: String,
        required: [true, "Resume text is required"]
    },

    selfDescription: {
        type: String
    },

    matchScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },

    technicalQuestions: [technicalQuestionSchema],

    behavioralQuestions: [behavioralQuestionSchema],

    skillGaps: [skillGapSchema],

    preparationPlan: [preparationPlanSchema],

    title: {
        type: String,
        required: [true, "Job title is required"]
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Report", reportSchema);