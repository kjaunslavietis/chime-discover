import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Checkbox from '@material-ui/core/Checkbox';
import ConversationService from './../services/ConversationService';
import FormControlLabel from '@material-ui/core/FormControlLabel';

export default function CreateConversation(props) {
	const { open, handleClose, handleCreate } = props;
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [category, setCategory] = useState("");
	const [nameIsMissing, setNameIsMissing] = useState(false);
	const [descriptionIsMissing, setDescriptionIsMissing] = useState(false);
	const [categoryIsMissing, setCategoryIsMissing] = useState(false);
	const [checked, setChecked] = useState(false);

	const handleClickOnCreate = () => {
		let error = false;
		if (!name.replace(/ /g,"")) {
			setNameIsMissing(true);
			error = true;
		}
		if (!description.replace(/ /g,"")) {
			setDescriptionIsMissing(true);
			error = true;
		}
		if (!category.replace(/ /g,"")) {
			setCategoryIsMissing(true);
			error = true;
		}

		if (!error) {
			handleCreate(name, description, category, checked);
		}
	}

	const onNameChange = (e) => {
		setNameIsMissing(false);
		setName(e.target.value);
	}

	const onDescriptionChange = (e) => {
		setDescriptionIsMissing(false);
		setDescription(e.target.value);
	}

	const onCategoryChange = (e) => {
		setCategoryIsMissing(false);
		setCategory(e.target.value);
	}

	const handleCheck = (event) => {
		setChecked(event.target.checked);
	  };

	return (
		<Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
			<DialogTitle id="form-dialog-title">Let's create a new room!</DialogTitle>
			<DialogContent>
				<DialogContentText>
					To do so, you need to give us some info:
            </DialogContentText>
				<TextField
					autoFocus
					margin="dense"
					id="name"
					label="A cool name"
					value={name}
					error={nameIsMissing}
					helperText={nameIsMissing ? "Name is missing" : ""}
					onChange={onNameChange}
					fullWidth
				/>
				<TextField
					margin="dense"
					id="description"
					label="A description"
					value={description}
					error={descriptionIsMissing}
					helperText={descriptionIsMissing ? "Description is missing" : ""}
					onChange={onDescriptionChange}
					fullWidth
				/>
				<TextField
					margin="dense"
					id="category"
					label="A category"
					value={category}
					error={categoryIsMissing}
					helperText={categoryIsMissing ? "Category is missing" : ""}
					onChange={onCategoryChange}
					fullWidth
				/>
				<div style={{marginTop: "10px"}}>
					<FormControlLabel
						control={
							<Checkbox
								checked={checked}
								onChange={handleCheck}
								name="check"
								color="primary"
							/>
						}
						label="Check this to let us record this room and extract keywords"
					/>
				</div>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose} color="primary">
					Cancel
            </Button>
				<Button onClick={handleClickOnCreate} color="primary">
					Create Room
            </Button>
			</DialogActions>
		</Dialog>
	);
}