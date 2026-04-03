import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { displayStars } from '../../../lib/functions';
import styles from './BookItem.module.css';

function BookItem({ book, size }) {
  let title;
  switch (size) {
    case 2:
      title = <h2>{book.title}</h2>;
      break;
    case 3:
      title = <h3>{book.title}</h3>;
      break;
    default:
      title = <h2>{book.title}</h2>;
      break;
  }

  // --- CORRECTION DE L'URL DE L'IMAGE ---
  // On remplace localhost par ton URL Render pour que les anciens livres s'affichent
  const finalImageUrl = book.imageUrl.replace('http://localhost:4000', 'https://mon-vieux-grimoire-mcuh.onrender.com');

  return (
    <Link to={`/livre/${book.id}`} className={styles.BookItem}>
      <article>
        {/* On utilise finalImageUrl ici au lieu de book.imageUrl */}
        <img
          className={styles.BookImage}
          src={finalImageUrl}
          alt={`${book.title}, ${book.author} - ${book.year}`}
        />
        <div className={styles.BookInfo}>
          <div className={styles.Rating}>
            {displayStars(book.averageRating)}
          </div>
          {title}
          <p>{book.author}</p>
          <p>{book.year}</p>
          <p>{book.genre}</p>
        </div>
      </article>
    </Link>
  );
}

BookItem.propTypes = {
  size: PropTypes.number.isRequired,
  book: PropTypes.shape({
    id: PropTypes.string,
    userId: PropTypes.string,
    title: PropTypes.string,
    author: PropTypes.string,
    year: PropTypes.number,
    imageUrl: PropTypes.string,
    genre: PropTypes.string,
    ratings: PropTypes.arrayOf(PropTypes.shape({
      userId: PropTypes.string,
      grade: PropTypes.number,
    })),
    averageRating: PropTypes.number,
  }).isRequired,
};

export default BookItem;
