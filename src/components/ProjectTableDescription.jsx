import React from 'react';

const ProjectTableDescription = ({ label, text }) => {
	return (
		<div className="project-table-description">
			<span>{label}:</span> {text}
		</div>
	);
};

export default ProjectTableDescription;
