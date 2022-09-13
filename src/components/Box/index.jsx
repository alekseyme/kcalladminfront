import React from 'react';
import styles from './Box.module.css';

const Box = ({ children, compact }) => {
	return (
		<div className={compact ? `${styles.main} ${styles.compact}` : styles.main}>{children}</div>
	);
};

export default Box;
