import mongoose from 'mongoose';

let sectionSchema = new mongoose.Schema({
	title: { type: String },
	description: { type: String },
	repeatable: { 
		type: Boolean,
		default: false
	},
	position: {
		type: Number,
		required: true,
		get: v => Math.round(v),
		set: v => Math.round(v)
	},
	document: {type: mongoose.Schema.Types.ObjectId, ref: 'Document'},
	master: {type: mongoose.Schema.Types.ObjectId, ref: 'Section'},
	children: [{type: mongoose.Schema.Types.ObjectId, ref:'Section'}],
	inputs: [{type: mongoose.Schema.Types.ObjectId, ref:'Input'}]
});

export default mongoose.model('Section', sectionSchema);