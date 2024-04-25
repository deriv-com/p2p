import { render, screen } from '@testing-library/react';
import StarRating from '../StarRating';

describe('StarRating', () => {
    it('should render the passed filled/empty star icons', () => {
        render(<StarRating ratingValue={3.3} />);
        expect(screen.queryAllByTestId('dt_star_rating_empty_star')).toHaveLength(5);
        expect(screen.queryAllByTestId('dt_star_rating_full_star')).toHaveLength(5);
    });
});
