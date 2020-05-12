import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Dropdown } from 'reactjs-dropdown-component';
import { DropzoneArea } from 'material-ui-dropzone'

import './dropdown.sass';

const useStyles = makeStyles((theme) => ({
	imageUpload: {
		minHeight: "auto",
	}
}))

export default function CreateConversation(props) {
	const classes = useStyles();

	const { open, handleClose, handleCreate, categories} = props;
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [category, setCategory] = useState("");
	const [image, setImage] = useState(null);
	const [nameIsMissing, setNameIsMissing] = useState(false);
	const [descriptionIsMissing, setDescriptionIsMissing] = useState(false);
	const [categoryIsMissing, setCategoryIsMissing] = useState(false);
	const [checked, setChecked] = useState(false);
	// const categories = [
	// 	{
	// 	  id: 0,
	// 	  title: 'New York',
	// 	  selected: false,
	// 	  key: 'location'
	// 	},
	// 	{
	// 	  id: 1,
	// 	  title: 'Dublin',
	// 	  selected: false,
	// 	  key: 'location'
	// 	},
	// 	{
	// 	  id: 2,
	// 	  title: 'Istanbul',
	// 	  selected: false,
	// 	  key: 'location'
	// 	}
	//   ]

	const handleClickOnCreate = () => {
		let error = false;
		if (!name.replace(/ /g, "")) {
			setNameIsMissing(true);
			error = true;
		}
		if (!description.replace(/ /g, "")) {
			setDescriptionIsMissing(true);
			error = true;
		}
		if (!category.replace(/ /g, "")) {
			setCategoryIsMissing(true);
			error = true;
		}

		if (!error) {
			handleCreate(name, description, category, checked, image);
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
	
	const onImageChange = (e) => {
		setImage(e && e.length > 0 ? e[0] : null);
	}

	const handleCheck = (event) => {
		setChecked(event.target.checked);
	};

	const resetThenSet = (id, key) => {
		console.log("ALLL CATAS" + JSON.stringify(categories))
		setCategoryIsMissing(false);
		setCategory(categories[id].title);
	  }

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
				<Dropdown 
					searchable={["Search for category", "No matching category"]}
					title = {category ? category : "Search for categoty"}
					list={categories}
					resetThenSet={resetThenSet}
				/>

				<DropzoneArea
					onChange={onImageChange}
					acceptedFiles={["image/*"]}
					filesLimit={1}
					dropzoneText={"An image (optional)"}
					showAlerts={false}
					dropzoneClass={classes.imageUpload}
				/>
				<div style={{ marginTop: "10px" }}>
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