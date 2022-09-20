const {Thought, User} = require('../models');

module. exports = {
    // get all thoughts
    getThoughts(req, res) {
        Thought.find({})
        .then((thoughts) => res.json(thoughts))
        .catch((err) => res.status(500).json(err));
    },
    // get one thought by id
    getSingleThought(req, res) {
        Thought.findOne({ _id: req.params.id })
        .select('-__v')
        .then((thought) =>
            !thought
            ? res.status(404).json({ message: 'No thought found with this id!' })
            : res.json(thought)
        )
        .catch((err) => res.status(500).json(err));
    },
    // create thought
    createThought(req, res) {
        Thought.create(req.body)
        .then((thought) => {
            return User.findOneAndUpdate(
                { _id: req.params.userId },
                { $push: { thoughts: thought._id } },
                { new: true }
            );
        })
        .then((dbUserData) => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id!' });
                return;
            }
            res.json(dbUserData);
        })
        .catch((err) => res.status(500).json(err));
    },
    // update thought by id
    updateThought(req, res) {
        Thought.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
        .then((thought) => {
            if (!thought) {
                res.status(404).json({ message: 'No thought found with this id!' });
                return;
            }
            res.json(thought);
        })
        .catch((err) => res.status(500).json(err));
    },
    // delete thought
    deleteThought(req, res) {
        Thought.findOneAndDelete({ _id: req.params.id })
        .then((thought) => {
            if (!thought) {
                res.status(404).json({ message: 'No thought found with this id!' });
                return;
            }
            return User.findOneAndUpdate(
                { _id: req.params.userId },
                { $pull: { thoughts: req.params.id } },
                { new: true }
            );
        })
        .then((dbUserData) => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id!' });
                return;
            }
            res.json(dbUserData);
        })
        .catch((err) => res.status(500).json(err));
    },
    // add reaction
    addReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.id },
            { $addToSet: { reactions: req.body } },
            { new: true }
        )
        .then((thought) => {
            if (!thought) {
                res.status(404).json({ message: 'No thought found with this id!' });
                return;
            }
            res.json(thought);
        })
        .catch((err) => res.status(500).json(err));
    },
    // remove reaction
    removeReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.id },
            { $pull: { reactions: { reactionId: req.params.reactionId } } },
            { new: true }
        )
        .then((thought) => res.json(thought))
        .catch((err) => res.status(500).json(err));
    }
};

    
