// on importe notre schemat de donnes
const Sauce = require('../models/Sauce');
// on importe le package file systeme de node
const fs = require('fs');
// on cree nos controleurs de routes
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({ message: "sauce enregistrée" }))
        .catch(error => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
    if (!sauce) {
        res.status(404).json({
            error: new Error('No such Sauce!')
        });
    }
    if (sauce.userId !== req.auth.userId) {
        res.status(400).json({
            error: new Error('Unauthorized request!')
        });
    }
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'sauce update' }))
        .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {

            if (!sauce) {
                res.status(404).json({
                    error: new Error('No such Sauce!')
                });
            }
            if (sauce.userId !== req.auth.userId) {
                res.status(400).json({
                    error: new Error('Unauthorized request!')
                });
            }
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'sauce delete' }))
                    .catch(error => res.status(400).json({ error }));
            })
        })
        .catch(error => res.status(500).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));

};

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

exports.liking = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (req.body.like == 1) {
                sauce.usersLiked.push(req.body.userId);
                sauce.likes++
            }

            if (req.body.like == -1) {
                sauce.usersDisliked.push(req.body.userId);
                sauce.dislikes++
            }

            if (req.body.like == 0) {
                if (sauce.usersLiked.includes(req.body.userId)) {
                    sauce.usersLiked = sauce.usersLiked.filter(s => s != req.body.userId);
                    sauce.likes--
                }
                if (sauce.usersDisliked.includes(req.body.userId)) {
                    sauce.usersDisliked = sauce.usersDisliked.filter(s => s != req.body.userId);
                    sauce.dislikes--
                }
            }
            sauce.save()
                .then(() => res.status(201).json({ message: "avis pris en compte" }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => {
            console.error(error)
            res.status(404).json({ error })
        })
}