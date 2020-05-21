import React, { useState, useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';


import { DropzoneArea } from 'material-ui-dropzone'

import PreviewCard from './PreviewCard';

import './dropdown.sass';

const useStyles = makeStyles((theme) => ({
	imageUpload: {
		minHeight: "auto",
		marginTop: "10px"
	},
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
	// console.log(JSON.stringify(categories));
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

	useEffect(() => {
		setName("");
		setDescription("");
		setCategory("");
		setImage(null);
		setNameIsMissing(false);
		setDescriptionIsMissing(false);
		setCategoryIsMissing(false);
		setChecked(false);
    }, [open])

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

	const onCategoryChange = (e) => {
		setCategoryIsMissing(false);
		setCategory(e.target.textContent);
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
				<Autocomplete
					margin="dense"
					id="category"
					options={categories}
					fullWidth
					value={category}
					onChange={onCategoryChange}
					renderInput={(params) => <TextField {...params} helperText={categoryIsMissing ? "Category is missing" : ""} error={categoryIsMissing} label="A category" />}
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
				{
					name && description && category ?
						<ExpansionPanel>
							<ExpansionPanelSummary
								expandIcon={<ExpandMoreIcon />}
								aria-controls="panel1a-content"
								id="panel1a-header"
								>
								<h5>Preview</h5>
							</ExpansionPanelSummary>
							<ExpansionPanelDetails>
								<PreviewCard 
										name={name}
										description={description}
										category={category}
										canBeAnalyzed={checked}
										image={image ? URL.createObjectURL(image) : "https://source.unsplash.com/random"}
								/>
							</ExpansionPanelDetails>
						</ExpansionPanel>
						:
						null
				}
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