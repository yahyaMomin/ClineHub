import React from 'react';

import Carousel from '../../../components/carousel/Carousel';
import useFetch from '../../../hooks/usefetch';
const Recommendation = ({ mediaType, id }) => {
	const { data, loading, error } = useFetch(`/${mediaType}/${id}/recommendations`);

	return (
		<>
			{data?.results ? (
				<div className='carouselSection'>
					<Carousel title='Recommendations' data={data?.results} loading={loading} endPoint={mediaType} />
				</div>
			) : (
				''
			)}
		</>
	);
};

export default Recommendation;
