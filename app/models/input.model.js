import mongoose from 'mongoose';

let inputSchema = new mongoose.Schema({
	label: { type: String },
	placeholder: { type: String },
	description: { type: String },
	dataType: { 
		type: String,
		enum: ["File", "Short Text", "Number", "Percentage", "Long Text", "Date"]
	},
	choices: {
		type: [String]
	},
	documentUrl: { type: String },
	allowMultipleChoiceSelections: {
		type: Boolean,
		required: true,
		default: false
	},
	repeatable: {
		type: Boolean,
		required: true,
		default: false
	},
	requiresEncryption: {
		type: Boolean,
		required: true,
		default: false
	},
	position: {
		type: Number,
		required: true,
		get: v => Math.round(v),
		set: v => Math.round(v)
	},
	section: {type: mongoose.Schema.Types.ObjectId, ref: 'Section'},
	master: {type: mongoose.Schema.Types.ObjectId, ref: 'Input'},
	children: [{type: mongoose.Schema.Types.ObjectId, ref:'Input'}],
	responses: [{type: mongoose.Schema.Types.ObjectId, ref:'Response'}]
});

export default mongoose.model('Input', inputSchema);