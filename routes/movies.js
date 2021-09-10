const express = require('express');
const router = express.Router();

const Movie = require('../models/Movie');

// list all movies
router.get('/', (req, res) => {
  const promise = Movie.aggregate([
    {
      $lookup: {
        from: 'directors',
        localField: 'director_id',
        foreignField: '_id',
        as: 'director',
      }
    },
    {
      $unwind: {
        path: '$director',
        preserveNullAndEmptyArrays: true,
      }
    },
  ]);
  promise
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json(err);
    });
});

// get the top 10 movies
router.get('/top10', (req, res) => {
  const promise = Movie.find({ }).limit(10).sort({ imdb_score: -1 });
  promise
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json(err);
    });
});

// create a new movie
router.post('/', (req, res) => {
  // const { title, imdb_score, category, country, year } = req.body;

  const movie = new Movie(req.body);

  // movie.save((err, data) => {
  //   if (err) {
  //     res.json(err);
  //   } else {
  //     res.json(data);
  //   }
  // }) 

  const promise = movie.save();
  promise
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json(err);
    });
});

// get a movie
router.get('/:movie_id', (req, res, next) => {
  const promise = Movie.findById(req.params.movie_id);
  promise
    .then((movie) => {
      if (!movie) { 
        next({ message: 'The movie was not found.', code: 404})
      } else {
        res.json(movie);
      }
    })
    .catch((err) => {
      res.json(err);
    });
});

// update a movie with new info
router.put('/:movie_id', (req, res, next) => {
  const promise = Movie.findByIdAndUpdate(
    req.params.movie_id, 
    req.body,
  );
  promise
    .then((movie) => {
      if (!movie) { 
        next({ message: 'The movie was not found.', code: 404})
      } else {
        res.json({ status: 1 });
      }
    })
    .catch((err) => {
      res.json(err);
    });
});

// delete a movie
router.delete('/:movie_id', (req, res, next) => {
  const promise = Movie.findByIdAndRemove(req.params.movie_id);
  promise
    .then((movie) => {
      if (!movie) { 
        next({ message: 'The movie was not found.', code: 404})
      } else {
        res.json({ status: 1 });
      }
    })
    .catch((err) => {
      res.json(err);
    });
});

// movies between two dates
router.get('/between/:start_year/:end_year', (req, res) => {
  const { start_year, end_year } = req.params;
  const promise = Movie.find(
    {
      year: { "$gte": parseInt(start_year), "$lte": parseInt(end_year) }
    }
  );
  promise
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json(err);
    });
});

module.exports = router;
