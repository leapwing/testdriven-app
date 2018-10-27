import React, { Component } from 'react';
import axios from 'axios';
import AceEditor from 'react-ace';
import 'brace/mode/python';
import 'brace/theme/solarized_dark';

const Exercise = (props) => {
	return (
		<div key="props.exercise.id">
			<h5 className="title is-5">{props.exercise.body}</h5>
			<AceEditor
				mode="python"
				theme="solarized_dark"
				name={props.exercise.id.toString()}
				fontSize={14}
				height={'175px'}
				showPrintMargin={true}
				showGutter={true}
				highlightActiveLine={true}
				value={props.editor.value}
				onChange={props.onChange}
				style={{
					marginBottom: '10px'
				}}
				editorProps={{
					$blockScrolling: Infinity
				}}
			/>
			{props.isAuthenticated && (
				<div>
					<button
						className="button is-primary"
						onClick={props.submitExercise}
						disabled={props.editor.button.isDisabled}
					>
						Run Code
					</button>
					{props.editor.showGrading && (
						<h5 className="title is-5">
							<span className="icon is-large">
								<i className="fas fa-spinner fa-pulse" />
							</span>
							<span className="grade-text">Grading</span>
						</h5>
					)}
					{props.editor.showCorrect && (
						<h5 className="title is-5">
							<span className="icon is-large">
								<i className="fas fa-check" />
							</span>
							<span className="grade-text">Correct!</span>
						</h5>
					)}
					{props.editor.showIncorrect && (
						<h5 className="title is-5">
							<span className="icon is-large">
								<i className="fas fa-times" />
							</span>
							<span className="grade-text">Incorrect!</span>
						</h5>
					)}
				</div>
			)}
		</div>
	);
};

export default Exercise;
