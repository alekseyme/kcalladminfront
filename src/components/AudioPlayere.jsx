import React from 'react';

const AudioPlayere = ({ src }) => {
	return <audio controls src={src?.url}></audio>;
};

export default AudioPlayere;
