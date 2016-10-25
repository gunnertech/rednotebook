import mongoose from '../models/mongoose';

let partSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	position: {
		type: Number,
		required: true,
		get: v => Math.round(v),
		set: v => Math.round(v)
	},
	notebook: {type: mongoose.Schema.Types.ObjectId, ref: 'Notebook'},
  documents: [{type: mongoose.Schema.Types.ObjectId, ref:'Document'}]
});

export default mongoose.model('Part', partSchema);