import mongoose from 'mongoose';

let documentSchema = new mongoose.Schema({
	title: { type: String },
	position: {
		type: Number,
		required: true,
		get: v => Math.round(v),
		set: v => Math.round(v)
	},
	section: {type: mongoose.Schema.Types.ObjectId, ref: 'Section'},
	states: [{type: mongoose.Schema.Types.ObjectId, ref:'State'}],
  assignments: [{type: mongoose.Schema.Types.ObjectId, ref:'Assignment'}]
});

export default mongoose.model('Document', documentSchema);