const mongoose = require('mongoose');

const express = require('express');
const router = express.Router();

const Director = require('../models/Director');

// create a new director
router.post('/', (req, res, next) => {
  const director = new Director(req.body);
  const promise = director.save();

  promise
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json(err);
    });
});

// list all directors
router.get('/', (req, res) => {
  const promise = Director.aggregate([
    {
      $lookup: {
        from: 'movies',
        localField: '_id',
        foreignField: 'director_id',
        as: 'movies'
      }
    },
    {
      $unwind: {
        path: '$movies',
        preserveNullAndEmptyArrays: true,
      }
    },
    {
      $group: {
        _id: {
          _id: '$_id',
          name: '$name',
          surname: '$surname',
          bio: '$bio',
        },
        movies: {
          $push: '$movies'
        }
      }
    },
    {
      $project: {
        _id: '$_id._id',
        name: '$_id.name',
        surname: '$_id.surname',
        movies: '$movies'
      }
    }
  ]);

  promise
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json(err);
    });
});

// get a director
router.get('/:director_id', (req, res) => {
  const promise = Director.aggregate([
    {
      $match: {
        '_id': mongoose.Types.ObjectId(req.params.director_id),
      }
    },
    {
      $lookup: {
        from: 'movies',
        localField: '_id',
        foreignField: 'director_id',
        as: 'movies'
      }
    },
    {
      $unwind: {
        path: '$movies',
        preserveNullAndEmptyArrays: true,
      }
    },
    {
      $group: {
        _id: {
          _id: '$_id',
          name: '$name',
          surname: '$surname',
          bio: '$bio',
        },
        movies: {
          $push: '$movies'
        }
      }
    },
    {
      $project: {
        _id: '$_id._id',
        name: '$_id.name',
        surname: '$_id.surname',
        movies: '$movies'
      }
    }
  ]);

  promise
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json(err);
    });
});

// update a director with new info
router.put('/:director_id', (req, res, next) => {
  const promise = Director.findByIdAndUpdate(
    req.params.director_id, 
    req.body,
  );
  promise
    .then((director) => {
      if (!director) { 
        next({ message: 'The director was not found.', code: 404})
      } else {
        res.json({ status: 1 });
      }
    })
    .catch((err) => {
      res.json(err);
    });
});

// delete a director
router.delete('/:director_id', (req, res, next) => {
  const promise = Director.findByIdAndRemove(req.params.director_id);
  promise
    .then((director) => {
      if (!director) { 
        next({ message: 'The director was not found.', code: 404})
      } else {
        res.json({ status: 1 });
      }
    })
    .catch((err) => {
      res.json(err);
    });
});

module.exports = router;